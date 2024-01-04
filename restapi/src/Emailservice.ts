import * as amqp from 'amqplib';
import { connect, ConfirmChannel } from 'amqplib';
declare var Buffer;

class EmailService {
 
private connection: amqp.Connection | null = null;
private channel: ConfirmChannel | null = null;

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
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
    }
  }

  async sendEmail(email: string, message: string): Promise<void> {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized.');
      return;
    }

    const exchangeName = 'email_exchange';
    const routingKey = 'email_routing_key';

    this.channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify({ email, message })), {
      persistent: true, 
    }); }
}

export default EmailService;
