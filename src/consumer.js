import amqp from "amqplib";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool();

async function initConsumer() {
  const host = process.env.RABBITMQ_HOST || "localhost";
  const port = process.env.RABBITMQ_PORT || 5672;
  const user = process.env.RABBITMQ_USER || "guest";
  const password = process.env.RABBITMQ_PASSWORD || "guest";

  try {
    const connection = await amqp.connect(
      `amqp://${user}:${password}@${host}:${port}`,
    );
    const channel = await connection.createChannel();

    const queueName = "applications";
    await channel.assertQueue(queueName, { durable: true });

    console.log(
      ` [*] Consumer siap mendengarkan pesan pada antrean [${queueName}]. Untuk keluar tekan CTRL+C`,
    );

    channel.consume(queueName, async (message) => {
      if (message !== null) {
        try {
          const content = JSON.parse(message.content.toString());
          const { application_id } = content;

          console.log(
            ` [x] Menerima data lamaran pekerjaan dengan ID: ${application_id}`,
          );

          const query = {
            text: "UPDATE applications SET updated_at = $1 WHERE id = $2 RETURNING id",
            values: [new Date().toISOString(), application_id],
          };

          const result = await pool.query(query);

          if (result.rows.length > 0) {
            console.log(
              ` [✓] Sukses memperbarui timestamp lamaran ${application_id} di PostgreSQL.`,
            );
          } else {
            console.log(
              ` [!] Warning: ID Lamaran ${application_id} tidak ditemukan di database.`,
            );
          }


          channel.ack(message);
        } catch (processError) {
          console.error(
            " [x] Gagal memproses isi pesan:",
            processError.message,
          );

          channel.nack(message);
        }
      }
    });
  } catch (error) {
    console.error(" [!] Gagal menjalankan RabbitMQ Consumer:", error.message);

    setTimeout(initConsumer, 5000);
  }
}

initConsumer();
