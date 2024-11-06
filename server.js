const http = require('http');
const url = require('url');

const PORT = 3000;
const contacts = []; // In-memory storage for contacts
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
  
    // Set response headers
    res.setHeader('Content-Type', 'application/json');
  
    if (path === '/contacts' && method === 'GET') {
      // Get all contacts
      res.statusCode = 200;
      res.end(JSON.stringify(contacts));
  
    } else if (path === '/contacts' && method === 'POST') {
      // Create a new contact
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { name, email, phone } = JSON.parse(body);
        const newContact = { id: contacts.length + 1, name, email, phone };
        contacts.push(newContact);
        res.statusCode = 201;
        res.end(JSON.stringify(newContact));
      });
  
    } else if (path.match(/\/contacts\/\d+/) && method === 'GET') {
      // Get a single contact by ID
      const id = parseInt(path.split('/')[2]);
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        res.statusCode = 200;
        res.end(JSON.stringify(contact));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Contact not found' }));
      }
  
    } else if (path.match(/\/contacts\/\d+/) && method === 'PUT') {
      // Update a contact by ID
      const id = parseInt(path.split('/')[2]);
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { name, email, phone } = JSON.parse(body);
        const contact = contacts.find(c => c.id === id);
        if (contact) {
          contact.name = name;
          contact.email = email;
          contact.phone = phone;
          res.statusCode = 200;
          res.end(JSON.stringify(contact));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: 'Contact not found' }));
        }
      });
  
    } else if (path.match(/\/contacts\/\d+/) && method === 'DELETE') {
      // Delete a contact by ID
      const id = parseInt(path.split('/')[2]);
      const contactIndex = contacts.findIndex(c => c.id === id);
      if (contactIndex !== -1) {
        const deletedContact = contacts.splice(contactIndex, 1);
        res.statusCode = 200;
        res.end(JSON.stringify(deletedContact));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Contact not found' }));
      }
  
    } else {
      // Handle unsupported routes
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Route not found' }));
    }
  });
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });    