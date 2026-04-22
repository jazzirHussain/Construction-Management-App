import express from "express";
import JanusController from "../controllers/Janus.js";
import Project from "../models/Project.js";
import { Janus } from "janus-gateway-node";

const router = express.Router();
// Route to create a Janus session
router.post('/create-session', JanusController.createSession);

// Route to attach to the Streaming plugin
router.post('/attach-plugin', JanusController.attachPlugin);

// Route to add a stream
router.post('/add-stream', JanusController.addStream);

// Route to start a stream
router.post('/start-stream', JanusController.startStream);

// Route to stop a stream
router.post('/stop-stream', JanusController.stopStream);

// Route to stop a stream
router.post('/list-stream', JanusController.listStreams);

let activeSessions = {}; // Track active sessions for each project
const JANUS_URL = 'http://localhost:8088/janus'; // Replace with your Janus server URL


router.get('/stream/project/:projectId', async (req, res) => {
  const { projectId } = req.params;

  if (!activeSessions[projectId]) {
    // If no session exists, create one for the project's cameras
    const { connection, cameraPlugins } = await createJanusSessionForProject(projectId);
    activeSessions[projectId] = { connection, cameraPlugins };
  }

  // Send back camera info (e.g., RTSP mountpoint IDs)
  const project = await Project.findById(projectId);
  res.json({
    cameras: project.cameras
  });
});

async function createJanusSessionForProject(projectId) {
  const project = await Project.findById(projectId);

  // Initialize Janus session and stream cameras
  const janus = new Janus.Client(JANUS_URL, {
    keepAlive: true
  });
  const connection = await janus.createConnection(projectId);

  const cameraPlugins = [];
  for (const camera of project.cameras) {
    const plugin = await connection.createPlugin('janus.plugin.streaming');
    await plugin.message({
      request: 'create',
      type: 'rtsp',
      description: camera.name,
      id: camera._id,
      url: camera.rtspUrl, // RTSP URL from the project
      audio: false,
      video: true
    });
    cameraPlugins.push(plugin);
  }
  return { connection, cameraPlugins };
}


export default router