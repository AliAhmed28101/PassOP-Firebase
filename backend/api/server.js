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
    const userUid = req.query.uid; // pass UID from frontend as query param

    if (!userUid) {
      return res.status(400).json({ success: false, message: "User UID is required" });
    }

    const snapshot = await db.collection("passwords").where("uid", "==", userUid).get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error getting passwords" });
    console.log(err);
  }
});



// Save a password
app.post('/save', async (req, res) => {
  try {
    
    const { site, username, password, uid } = req.body;

    const doc = await db.collection("passwords").add({ 
      site, username, password, uid, createdAt: new Date()
    });


    console.log("Data of passwords", req.body)
    res.json({ success: true, result:{id: doc.id, site, username, password, uid} });

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
