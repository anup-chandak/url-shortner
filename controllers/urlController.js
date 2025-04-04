const Url = require('../models/URLs.js'); // import your Mongoose model

const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function encodeBase62(num) {
  let shortUrl = '';
  while (num > 0) {
    shortUrl = base62Chars[num % 62] + shortUrl;
    num = Math.floor(num / 62);
  }
  return shortUrl;
}

// Helper function to generate a random unique numeric ID within a large range
async function generateUniqueRandomId() {
  let uniqueId, shortId, record;
  // Use a sufficiently large range to reduce collision probability (e.g. up to 1e9)
  do {
    uniqueId = Math.floor(Math.random() * 1e9);
    shortId = encodeBase62(uniqueId);
    // Check if a record with this short URL already exists
    record = await Url.findOne({ shortUrl: `${process.env.DOMAIN_URL}/${shortId}` });
  } while (record);
  return { uniqueId, shortId };
}

// Main shortenUrl controller using random unique IDs
exports.shortenUrl = async (req, res) => {
  const { longUrl } = req.body;

  try {
    // Check if longUrl already exists in the DB using the Mongoose model.
    let urlRecord = await Url.findOne({ longUrl });
    if (urlRecord) {
      return res.json({ shortUrl: `${process.env.DOMAIN_URL}/${urlRecord.shortUrl}` });
    }

    // Generate a random unique numeric ID and encode it to Base62.
    const { shortId } = await generateUniqueRandomId();
    const shortUrl = shortId;

    // Create a new record using the Url model and save it to the database.
    urlRecord = new Url({ longUrl, shortUrl });
    await urlRecord.save();

    // Return the generated short URL as a JSON response.
    res.json({ shortURL : `${process.env.DOMAIN_URL}/${shortUrl}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.redirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const record = await Url.findOne({ shortUrl:  shortCode });
    console.log("---",record, shortCode)
    if (record) {
      // If a matching record is found, redirect to the original long URL.
      res.redirect(record.longUrl);
      return
    } else {
      // If no record is found, respond with a 404 error.
      res.status(404).json({ error: 'URL not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};
