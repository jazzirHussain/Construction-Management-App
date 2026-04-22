import JanusService from '../Services/Janus.js';

class JanusController {
  // Create a Janus session
  static async createSession(req, res) {
    try {
      const sessionId = await JanusService.createSession();
      res.send({ sessionId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  // Attach to the Streaming plugin
  static async attachPlugin(req, res) {
    const { sessionId } = req.body;
    try {
      const handleId = await JanusService.attachPlugin(sessionId);
      res.send({ handleId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  // Add a stream
  static async addStream(req, res) {
    const { sessionId, handleId, rtspUrl } = req.body;
    try {
      const streamId = await JanusService.addStream(sessionId, handleId, rtspUrl);
      res.send({ streamId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  // Start a stream
  static async startStream(req, res) {
    const { sessionId, handleId, streamId } = req.body;
    try {
      await JanusService.startStream(sessionId, handleId, streamId);
      res.send({ success: true });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  // Stop a stream
  static async stopStream(req, res) {
    const { sessionId, handleId, streamId } = req.body;
    try {
      await JanusService.stopStream(sessionId, handleId, streamId);
      res.send({ success: true });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  // Stop a stream
  static async listStreams(req, res) {
    try {
      const streams = await JanusService.listStreams();
      res.send({ success: true, streams: streams });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

export default JanusController;
