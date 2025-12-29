const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyparser = require('body-parser');
const { db } = require('../db/firebase.js')

dotenv.config();

// Connect to DB
// connectDB();

const app = express();
const port = 3000;


app.use(bodyparser.json());


const allowedOrigins = [
  "http://localhost:5173",
];


// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS NOT ALLOWED"));
  },
  credentials: true
}));






app.get('/', async (req, res) => {

  try {
    const Passwords = await db.collection("passwords").get();

    const data = Passwords.docs.map(item => ({
      id: item.id,
      ...item.data()

    }));
    res.json({ success: true, data: data });

  } catch (err) {

    res.status(500).json({ success: false, message: "Error getting passwords" })

  }
})

// Save a password
app.post('/save', async (req, res) => {
  try {

    const doc = await db.collection("passwords").add(req.body);


    console.log("Data of passwords", req.body)
    res.json({ success: true, result:{id: doc.id, ...req.body} });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving password", err });
    console.log(err)
  }
});

// Delete a password
app.delete("/delete/:id", async (req, res) => {

  try {
    const id = req.params.id

    const DeletePassword = await db.collection("passwords").doc(id).delete();
    res.json({ success: true, message: "Password deleted successfully" })

  } catch (err) {
    res.status(500).json({ success: false, message: "Error Deleting the Password", err });
    console.log(err)
  }
})

// app.delete("/delete", async (req, res) => {

//   try {
//     const { id } = req.body

//     if (!id) {
//       return res.status(400).json({ success: false, message: "ID is required" });
//     }

//     const deletepassword = await db.collection("passwords").doc(id).delete();
//     res.json({ success: true, message: "Password deleted successfully", result: deletepassword })
//   }

//   catch (err) {
//     res.status(500).json({ success: false, message: "Error Deleting the Password", err });
//     console.log(err)
//   }
// })





// update a password 

app.put('/update/:id', async (req, res) => {
  try {
    const  id  = req.params.id
    const  updatedData  = req.body

    const updatedPassword = await db.collection("passwords").doc(id).update(updatedData)
    res.json({ success: true, result: updatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating password" });
    console.log(err)
  }
});


// app.put('/update', async (req, res) => {
//   try {
  
//     const  {id, ...updatedData}  = req.body

//     const updatedPassword = await db.collection("passwords").doc(id).update(updatedData)
//     res.json({ success: true, result: updatedPassword });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error updating password" });
//     console.log(err)
//   }
// });


module.exports = app;


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
