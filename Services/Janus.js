import axios from 'axios';

const JANUS_URL = 'http://localhost:8088/janus'; // Replace with your Janus server URL

class JanusService {
  // Generate a unique transaction ID
  static generateTransactionId() {
    return `transaction_${Date.now()}`;
  }

  // Create a Janus session
  static async createSession() {
    const transaction = JanusService.generateTransactionId();
    try {
      const response = await axios.post(JANUS_URL, {
        janus: 'create',
        transaction
      });
      return response.data.data.id; // sessionId
    } catch (error) {
      console.error('Error creating Janus session:', error);
      throw new Error('Error creating Janus session');
    }
  }

  // Attach to the Streaming plugin
  static async attachPlugin(sessionId) {
    const transaction = JanusService.generateTransactionId();
    try {
      const response = await axios.post(`${JANUS_URL}/${sessionId}`, {
        janus: 'attach',
        plugin: 'janus.plugin.streaming',
        transaction
      });
      
      return response.data.data.id; // handleId
    } catch (error) {
      console.error('Error attaching to plugin:', error);
      throw new Error('Error attaching to plugin');
    }
  }

  // Add a stream
  static async addStream(sessionId, handleId, rtspUrl) {
    console.log(rtspUrl);
    
    const transaction = JanusService.generateTransactionId();
    try {
      const response = await axios.post(`${JANUS_URL}/${sessionId}/${handleId}`, {
        janus: 'message',
        body: {
          request: 'create',
          id: handleId, // Stream ID
          description: 'Test Stream',
          url: rtspUrl,
          type: 'rtsp',
          video: true,
          audio: false
        },
        transaction
      });
      console.log(response.data);

      return response.data.plugindata.data; // Stream ID
    } catch (error) {
      console.error('Error adding stream:', error);
      throw new Error('Error adding stream');
    }
  }

  // Start a stream
  static async startStream(sessionId, handleId, streamId) {
    const transaction = JanusService.generateTransactionId();
    try {
      await axios.post(`${JANUS_URL}/${sessionId}/${handleId}`, {
        janus: 'message',
        body: {
          request: 'start',
          id: streamId
        },
        transaction
      });
    } catch (error) {
      console.error('Error starting stream:', error);
      throw new Error('Error starting stream');
    }
  }

  // Stop a stream
  static async stopStream(sessionId, handleId, streamId) {
    const transaction = JanusService.generateTransactionId();
    try {
      await axios.post(`${JANUS_URL}/${sessionId}/${handleId}`, {
        janus: 'message',
        body: {
          request: 'stop',
          id: streamId
        },
        transaction
      });
    } catch (error) {
      console.error('Error stopping stream:', error);
      throw new Error('Error stopping stream');
    }
  }
  static async listStreams(sessionId, handleId, streamId) {
    const transaction = JanusService.generateTransactionId();
    try {
      const response = await axios.post(`${JANUS_URL}`, {
        janus: 'message',
        transaction: transaction,
        body: {
          request: "list" // For the Streaming plugin, it may need to be different
        },
        plugin: "janus.plugin.streaming" 
      });
      console.log(response);
      
      return response.data.data
    } catch (error) {
      console.error('Error stopping stream:', error);
      throw new Error('Error stopping stream');
    }
  }

}

export default JanusService;
