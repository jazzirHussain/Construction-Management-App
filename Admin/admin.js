import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose'
import User from '../models/User.js';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';
import Gallery from '../models/Gallery.js';
import Payment from '../models/Payment.js';
import Timeline from '../models/Timeline.js';
import ProjectRepository from '../repository/Project.js';
import { BLOG_FOLDER, GALLERY_FOLDER, PORTFOLIOS_FOLDER } from '../constants.js';
import { AWSCred, s3 } from '../utils/AWS/Services.js';
import uploadFeature from '@adminjs/upload';
import { componentLoader } from './component-loader.js';
import path from 'path'
import MongoStore from 'connect-mongo';
import BlogPost from '../models/BlogPost.js';
import Package from '../models/Packages.js';
import Portfolio from '../models/Portfolios.js';

// Register the Mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

const showListHideRest = {
  show: true,
  edit: false,
  list: false,
  filter: true,
  create: false,
  new: true
}

const authenticateAdmin = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user && user.role === 'admin') {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        return user;  // Optionally return the token if needed
      }
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }
  return null;
};

// Initialize AdminJS with resources
const adminJs = new AdminJS({
  componentLoader,
  resources: [
    {
      resource: User,
      options: {
        properties: {
          resetToken: { isVisible: false },
          resetExpires: { isVisible: false },
          profileImage: { isVisible: false },
          status: { isVisible: false },
          createdAt: { isVisible: showListHideRest },
          password: { isVisible: { create: true, show: false, edit: true, list: false, filter: false } }
        }
      }
    },
    { resource: Activity },
    { resource: Payment },
    { resource: Timeline },
    { resource: Package },
    {
      resource: Gallery,
      features: [
        uploadFeature({
          componentLoader,
          provider: { aws: { ...AWSCred, bucket: process.env.BUCKET_NAME } }, // For local storage, replace with your preferred storage provider (e.g., S3)
          properties: {
            key: 'images.url', // Field that stores the URL
            file: 'UploadImages', // Virtual property for file upload
            dir: 'images/gallery'
          },
          uploadPath: (record, filename) => {
            const ext = path.extname(filename); // Get file extension
            const today = new Date().toISOString()
            return `${GALLERY_FOLDER}/${record.params.project}/${today}.${ext}`; // Construct file path with today's date and extension
          },
          uploadUrl: (file) => `${process.env.BUCKET_URL}/${file.key}`,
        }),
      ],
    },
    {
      resource: BlogPost,
      options: {
        properties: {
          // Main Blog Post Image Upload
          imageFile: {
            type: 'file',
            isVisible: { list: false, edit: true, show: false, filter: false },
          },
          // Section Images Upload (Handled inside array)
          'sections.$.sectionImageFile': {
            type: 'file',
            isVisible: { list: false, edit: true, show: false, filter: false },
          },
          'sections.image': {
            isVisible: { list: true, edit: false, show: true, filter: true, create: false },
          },
          image: { isVisible: { list: true, edit: false, show: true, filter: true } }
        },
      },
      features: [uploadFeature({
        componentLoader,
        provider: { aws: { ...AWSCred, bucket: process.env.BUCKET_NAME } },
        properties: {
          key: 'image',  // Field in the schema where the main blog image path is stored
          file: 'imageFile',  // Virtual field for uploading the main blog image
          // Sections Image Upload
          'sections.$.file': 'sections.$.sectionImageFile',  // Use file field for each section image
          'sections.$.key': 'sections.$.image',
        },
        uploadPath: (record, filename) => {
          return `${BLOG_FOLDER}/${Date.now()}_${filename}`;
        },
        validation: {
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
      })],
    },
    {
      resource: Portfolio,
      options: {
        properties: {
          imageFiles: {
            type: 'file', // Use 'mixed' for multiple file uploads
            isVisible: { list: false, edit: true, show: false, filter: false },
          },
          images: {isVisible: {list: true, edit: false, show: true, filter: true}}
        },
      },
      features: [
        uploadFeature({
          componentLoader, // Load the component
          provider: { aws: { ...AWSCred, bucket: process.env.BUCKET_NAME } },
          multiple: true,
          properties: {
            key: 'images',  // Field in the schema where the image paths are stored
            file: 'imageFiles',  // Virtual field for uploading the images
          },
          uploadPath: (record, filename) => {
            return `${PORTFOLIOS_FOLDER}/${Date.now()}_${filename}`; // Adjust the path as needed
          },
          validation: {
            mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], // Allowed mime types
          },
        }),
      ],
    },
    {
      resource: Project,
      options: {
        actions: {
          new: {
            actionType: "resource",
            handler: async (request, response, context) => {
              if (request.method === 'post') {
                const projectData = request.payload;
                try {
                  const project = await ProjectRepository.add(projectData, {}, {}, {}, {})
                  return {
                    record: {
                      id: project._id,
                      title: project.name,
                      errors: {},
                    },
                    redirectUrl: context.h.recordActionUrl({
                      resourceId: context.resource.id(),
                      recordId: project._id,
                      actionName: 'show',
                    }),
                  };
                } catch (error) {
                  return {
                    record: {
                      errors: { message: error.message },
                    },
                  };
                }
              }
              return {}
            }
          },
          delete: {
            actionType: "record",
            handler: async (request, response, context) => {
              if (request.method === 'post') {
                const { record } = context;
                try {
                  const project = await ProjectRepository.delete(record.id())
                  return {
                    record: record.toJSON(),
                    notice: {
                      message: 'Record successfully deleted',
                      type: 'success',
                    },
                    redirectUrl: context.h.resourceActionUrl({
                      resourceId: context.resource.id(),
                      actionName: 'list',
                    }),
                  };
                } catch (error) {
                  return {
                    record: record.toJSON(),
                    notice: {
                      message: `Error deleting record: ${error.message}`,
                      type: 'error',
                    },
                  };
                }
              }
              return {}
            }
          }
        },
        properties: {
          payment: { isVisible: false },
          activities: { isVisible: false },
          timeline: { isVisible: false },
          gallery: { isVisible: false },
          createdAt: { isVisible: false },
        }
      }
    },
  ],
  rootPath: '/admin',
  branding: {
    logo: false, // Optionally hide the logo
    companyName: 'Rio Livings',
    softwareBrothers: false,
  },
  theme: {
    styles: {
      // Add custom styles to hide welcome page elements
      '.adminjs_Box': {
        display: 'none',
      },
      welcomePage: {
        display: 'none',
      },
    },
  },
});

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "session",
  stringify: false,
  autoRemove: "interval",
  autoRemoveInterval: 1
});

// Build the router for AdminJS
// const adminRouter = AdminJSExpress.buildRouter(adminJs);
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: authenticateAdmin,
  cookiePassword: 'your-session-secret',  // Use a secure session secret
},
  null,
  {
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    secret: 'sessionsecret',
    cookie: {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
    },
    name: 'adminjs',
  }
);

export { adminJs, adminRouter };