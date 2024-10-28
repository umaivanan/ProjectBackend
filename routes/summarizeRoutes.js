// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const pdf = require('pdf-parse');
// const { HfInference } = require('@huggingface/inference');
// const router = express.Router();

// // Initialize Hugging Face Inference
// const hf = new HfInference(process.env.HUGGING_FACE_API_KEY); // Use your Hugging Face API Key

// // POST /api/summarize - Text summarization endpoint
// router.post('/summarize', async (req, res) => {
//   const { text } = req.body;
//   if (!text) {
//     return res.status(400).json({ error: 'No text provided for summarization.' });
//   }

//   try {
//     // Use Hugging Face BART model for summarization
//     const summary = await hf.summarization({
//       model: 'facebook/bart-large-cnn',
//       inputs: text,
//     });

//     res.json({ summary: summary.summary_text });
//   } catch (error) {
//     console.error('Error during text summarization:', error);
//     res.status(500).json({ error: 'Error summarizing text.' });
//   }
// });

// // POST /api/summary - PDF summarization endpoint
// router.post('/summary', async (req, res) => {
//   let sampleFile;
//   let uploadPath;

//   // Check if a file was uploaded
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded. Try again.');
//   }

//   // Retrieve the uploaded file
//   sampleFile = req.files.uploadedfile;

//   // Ensure the upload directory exists
//   const uploadDir = path.join(__dirname, '../pdfUploads');
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//   }

//   // Set the file upload path
//   uploadPath = path.join(uploadDir, sampleFile.name);

//   // Save the file to the server
//   sampleFile.mv(uploadPath, async function (err) {
//     if (err) {
//       console.error('Error saving file:', err);
//       return res.status(500).send('Failed to upload file.');
//     }

//     try {
//       // Read and parse the PDF file
//       let dataBuffer = fs.readFileSync(uploadPath);
//       let data = await pdf(dataBuffer);

//       // Check if the PDF contains text
//       if (!data.text) {
//         throw new Error('Failed to extract text from PDF.');
//       }

//       // Summarize the PDF text
//       const summary = await hf.summarization({
//         model: 'facebook/bart-large-cnn',
//         inputs: data.text + ' TL;DR',
//       });

//       // Clean up the file after processing
//       fs.unlinkSync(uploadPath);

//       // Send the summary response back to the client
//       res.json({
//         id: new Date().getTime(),
//         text: summary.summary_text,
//       });
//     } catch (error) {
//       console.error('Error during processing:', error);
//       res.status(500).json({ error: 'An error occurred while summarizing the PDF.' });
//     }
//   });
// });

// module.exports = router;
