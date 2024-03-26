const dotenv=require('dotenv').config();
const express=require('express');
const hbs=require('hbs');
const nodemailer=require('nodemailer');
const mongoose=require('mongoose');
const User=require('./models/User.js');

mongoose.connect('mongodb://localhost:27017/ST1')
.then(console.log("mongodb connected"))
.catch((error)=>console.error(error));
const app=express();

app.use(express.json());  //allows server to handle Json encoded data sent in HTTP req
app.use(express.urlencoded()); // allows server to handle data submitted through html formats




app.set('view engine','hbs'); // register and verify import huye hai

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register', async (req, res) => {
        const { email, password } = req.body;

        // Validate email and password here...

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: '2003khushigoyal24@gmail.com',
                pass: process.env.PASS // Use environment variable
            }
        });

        const OTP = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
        const mail = {
            to: email,
            from: '2003khushigoyal24@gmail.com',
            subject: 'OTP for Verification',
            text: `Your OTP for verification is ${OTP}`

        };
        let isVerified=false;
        await transporter.sendMail(mail);
        const user = new User({ email, password ,OTP, isVerified});
        try{
        await user.save();

        
        // Redirect after sending the OTP email successfully
        res.redirect('/verify');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send("Error sending OTP"); // Handle error
    }
});

app.get('/verify',(req,res)=>{
 res.render('Verify');
})
app.post('/verify', async (req, res) => {
  const { OTP } = req.body;

  try {
      const user = await User.findOne({OTP});


      if (!user) {
          return res.status(400).send("Invalid OTP");
      }

      user.isVerified = true; 

      try {
          await user.save();
          res.send("OTP verified"); 
      } catch(saveErr) {
          console.error(saveErr);
          return res.status(500).send("Internal Server Error");
      }

  } catch(err) {
      console.error(err); 
      return res.status(500).send("Internal Server Error");
  }
});


app.listen(3000,()=>{
    console.log("Running");
})