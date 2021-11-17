'use strict';

const PDFKit = require('pdfkit');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const key = `football-stats-${Date.now()}.pdf`;

const generatePDF = async (text) => {
  return new Promise((resolve) => {
    const doc = new PDFKit();
    const buffers = [];
    doc.list(text, { listType: 'numbered' });
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdf = Buffer.concat(buffers);
      resolve(pdf);
    });
    doc.end();
  });
};

const savePDF = async (key, pdf) => {
  return await(new Promise((resolve) => {
    s3.putObject({
      Bucket: process.env.BUCKET,
      Key: key,
      Body: pdf,
      ContentType: 'application/pdf',
      ACL: 'public-read'
    }, (err, result) => {
      if(err) console.log('ERROR!', error);
      if(result) {
        console.log('RESULT!', result);
        resolve(result);
      }
    });
  }));
};

const generateURI = (keyValue) =>
  `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/${keyValue}`;

module.exports.generate = async ({body}) => {
  const text = JSON.parse(body) || 'Pending...';

  return generatePDF(text)
    .then((pdf) => savePDF(key, pdf))
    .then(() => ({
      statusCode: 200,
      body: generateURI(key),
    }));
};
