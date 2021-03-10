const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf == cpf);
  
  if(!customer)
    return res.status(400).json({ error: "Customer not found." });

  req.customer = customer;
  return next();
}

const customers = [];

app.post("/account", (req, res) => {
  const { name, cpf } = req.body;

  const customerAlrearyExists = customers.some((customer) => customer.cpf === cpf);

  if(customerAlrearyExists)
    return res.status(400).json({ error: "Customer already exists." });

  customers.push({
    name,
    cpf,
    id: uuidv4(),
    statement: [],
  });
  
  return res.status(201).send();
});

//app.use(verifyIfExistsAccountCPF);

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  return res.json(customer.statement);
});

app.listen(3333);