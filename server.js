const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Serve the main HTML file
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
    // Serve the CSS file
    else if (req.url === '/style.css' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'public', 'style.css'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    }
    // Serve the student data based on roll number
    else if (req.url.startsWith('/getStudent') && req.method === 'GET') {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const rollNumber = urlParams.get('rollNumber');

        if (rollNumber) {
            fs.readFile(path.join(__dirname, 'data', 'students.json'), (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to read data file' }));
                } else {
                    const students = JSON.parse(data);
                    const student = students.find(st => st.rollNumber === rollNumber);

                    if (student) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(student));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Student not found' }));
                    }
                }
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Roll number not provided' }));
        }
    }
    // Handle other requests with a 404
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
