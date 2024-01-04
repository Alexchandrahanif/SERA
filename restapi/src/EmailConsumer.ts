import * as amqp from 'amqplib';
import { connect, Channel, ConsumeMessage } from 'amqplib';

class EmailConsumer {
  private connection: amqp.Connection | null = null;
  private channel: Channel | null = null;

  constructor() {
    const rabbitMQUrl = 'amqp://localhost';

    this.connection = null;
    this.channel = null;
    this.init(rabbitMQUrl);
  }

  private async init(rabbitMQUrl: string): Promise<void> {
    try {
      // Membuat koneksi RabbitMQ
      this.connection = await amqp.connect(rabbitMQUrl);

      // Membuat channel RabbitMQ
      this.channel = await this.connection.createChannel();

      const exchangeName = 'email_exchange';
      await this.channel.assertExchange(exchangeName, 'direct', { durable: false });

      // Mendeklarasikan queue
      const queueName = 'email_queue';
      await this.channel.assertQueue(queueName, { durable: true });

      // Mengikat queue dengan exchange
      await this.channel.bindQueue(queueName, exchangeName, 'email_routing_key');

      // Mulai mengonsumsi pesan dari antrian
      this.consumeMessages(queueName);
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
    }
  }

  private consumeMessages(queueName: string): void {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized.');
      return;
    }

    // Menangani pesan yang diterima
    this.channel.consume(queueName, async (msg: ConsumeMessage | null) => {
      if (msg) {
        try {
          const content = msg.content.toString();
          const { email, message } = JSON.parse(content);

          // Lakukan sesuatu dengan pesan yang diterima, misalnya kirim email
          console.log(`Received email for ${email}: ${message}`);

          // Simulasi proses yang mungkin gagal
          const success = true; // Ganti dengan logika pemrosesan yang sesuai

          if (success) {
            // Konfirmasi bahwa pesan telah di-handle
            this.channel?.ack(msg);
          } else {
            // Tandai bahwa pesan tidak berhasil diproses, sehingga dapat diproses ulang
            this.channel?.nack(msg);
          }
        } catch (error) {
          console.error('Error processing message:', error);

          // Tandai bahwa pesan tidak berhasil diproses, sehingga dapat diproses ulang
          this.channel?.nack(msg);
        }
      }
    });
  }
}

export default EmailConsumer;
