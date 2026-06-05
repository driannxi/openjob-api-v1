import amqp from "amqplib";

class QueueService {
  async sendMessage(queue, message) {
    const host = process.env.RABBITMQ_HOST || "localhost";
    const port = process.env.RABBITMQ_PORT || 5672;
    const user = process.env.RABBITMQ_USER || "guest";
    const password = process.env.RABBITMQ_PASSWORD || "guest";

    let connection;
    try {
      connection = await amqp.connect(
        `amqp://${user}:${password}@${host}:${port}`,
      );
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true,
      });

      await channel.sendToQueue(queue, Buffer.from(message));

      await channel.close();
    } catch (error) {
      console.error("Gagal mengirimkan pesan ke RabbitMQ:", error);
      throw error;
    } finally {
      if (connection) {
        setTimeout(async () => {
          await connection.close();
        }, 500);
      }
    }
  }
}

export default new QueueService();
