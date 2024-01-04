// MessageConsumer.ts
import * as amqp from 'amqplib';
import { ConfirmChannel } from 'amqplib';

class MessageConsumer {
  private readonly channel: ConfirmChannel;

  constructor(channel: ConfirmChannel) {
    this.channel = channel;
  }

  // Metode untuk memulai konsumsi pesan
  startConsuming(callback: (data: { email: string; message: string }) => void): void {
    const queueName = 'email_queue';
    this.consume(queueName, callback);
  }

  private consume(queueName: string, callback: (data: { email: string; message: string }) => void): void {
    this.channel.consume(queueName, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());

        // Panggil callback untuk menangani pesan
        callback(data);

        // Mengonfirmasi bahwa pesan telah diproses dan bisa dihapus dari antrian
        this.channel.ack(msg);
      }
    });
  }
}

export default MessageConsumer;
