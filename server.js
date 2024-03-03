const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const RESPONSES_DIR = path.join(__dirname, 'responses');

fs.mkdirSync(RESPONSES_DIR, { recursive: true });

app.post('/submit-survey', (req, res) => {
    const timestamp = Date.now();
    const responsePath = path.join(RESPONSES_DIR, `response_${timestamp}.json`);
    
    fs.writeFile(responsePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            console.error('Error saving survey response:', err);
            return res.status(500).send('Error processing your survey response.');
        }

        res.redirect('/thank-you.html');
    });
});

app.get('/api/survey-results', (req, res) => {
    fs.readdir(RESPONSES_DIR, (err, files) => {
        if (err) {
            console.error('Error reading response directory:', err);
            return res.status(500).send('Error retrieving survey results.');
        }

        let responses = [];

        files.forEach(file => {
            const filePath = path.join(RESPONSES_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            try {
                const parsedContent = JSON.parse(content);
                responses.push(parsedContent);
            } catch (parseError) {
                console.error(`Error parsing ${file}:`, parseError);
            }
        });

        res.json(responses);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
