const os = require('os'); 

console.log(os.hostname()); 

require("dotenv").config();
const express = require("express");
const app = express();
const msgRouter = require("./api/msgs/msg.router");
const cors = require("cors");
const bodyParser = require('body-parser');
const pool = require("./config/db");
const stripe = require("stripe")("sk_test_51PE3BkSIWYmvFAZIXOqXLyuQTpqSJ6KjGrrFiBJxsZwdnirFEpxIsovOPdl2GHQrDrFCOJYRlcPvOsAx53BPmiEs003u3B1OY5");


app.use(cors());

app.use("/faq", msgRouter);



const mysql = require('mysql');

// Create a connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Shopify'
});

// Use the connection pool
app.post('/addcolor', (req, res) => {
  const { questionColor, answerColor, questionBgColor, answerBgColor, shopid } = req.body;
  const sql = "INSERT INTO `color` (`Question`, `Answer`, `QuestionBG`, `AnswerBG`, `Shopid`) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `Question` = VALUES(`Question`), `Answer` = VALUES(`Answer`), `QuestionBG` = VALUES(`QuestionBG`), `AnswerBG` = VALUES(`AnswerBG`);";
  const values = [questionColor, answerColor, questionBgColor, answerBgColor, shopid];
  console.log(questionColor, answerColor, questionBgColor, answerBgColor, shopid)
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.json({ success: false, error: err.message });
    }
    console.log("Data inserted successfully");
    return res.json({ success: true, data });
  });
});


app.get('/SelectQuetion', (req, res) => {
  const { Productid } = req.query;
  const sql = "SELECT * FROM `question&answer` WHERE `ProductId` = ? ;";
  const values = [Productid];
  console.log(Productid);
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error selecting data:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    console.log("Data selected successfully");
    return res.json({ success: true, data });
  });
});

// *****************
app.get('/Selectcolor', (req, res) => {
  const { shopid } = req.query;
  const sql = "SELECT * FROM `color` WHERE `Shopid` = ? ;";
  const values = [55700947046];
  console.log(shopid);
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error Select data:", err);
      return res.json({ success: false, error: err.message });
    }
    console.log("Data selected successfully");
    return res.json({ success: true, data });
  });
});



// ************update question 

app.put('/updatequestion', (req, res) => {
  const { ProductId, SaveQuestion, SaveAnswer, QuestionNo } = req.body; // Corrected to match frontend
  const sql = "UPDATE `question&answer` SET `Question` = ?, `Answer` = ? WHERE `ProductId` = ? AND `QuestionNo` = ?;";
  const values = [SaveQuestion, SaveAnswer, ProductId, QuestionNo];
  console.log(ProductId, SaveQuestion, SaveAnswer, QuestionNo);
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.json({ success: false, error: err.message });
    }
    console.log("Data updated successfully");
    return res.json({ success: true, data });
  });
});

// ******** delete question
app.delete('/deletequestion', (req, res) => {
  const { ProductId, QuestionNo } = req.body;
  const sql = "DELETE FROM `question&answer` WHERE `ProductId` = ? AND `QuestionNo` = ?;";
  const values = [ProductId, QuestionNo];
  console.log(ProductId, QuestionNo);
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error Delete data:", err);
      return res.json({ success: false, error: err.message });
    }
    console.log("Data delete successfully");
    return res.json({ success: true, data });
  });
});

//****************** add question  */
app.post('/addquestion', (req, res) => {
  const { ProductId, SaveQuestion, SaveAnswer, QuestionNo } = req.body; // Corrected variable name
  const sql = "INSERT INTO `question&answer` (`ProductId`, `Question`, `Answer`, `QuestionNo`) VALUES (?, ?, ?, ?)";
  const values = [ProductId, SaveQuestion, SaveAnswer, QuestionNo];
  console.log(ProductId, SaveQuestion, SaveAnswer, QuestionNo)
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.json({ success: false, error: err.message });
    }
    console.log("Data inserted successfully");
    return res.json({ success: true, data });
  });
});


//  ******* Payment Intergration *********
// app.post("/api/create-checkout-session", async (req, res) => {
//   try {
//     const { product } = req.body;
//     console.log(product);

//     const lineItems = product.map((product) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: product.dish,
//           images: [product.imgdata]
//         },
//         unit_amount: product.price * 100,
//       },
//       quantity: product.qnty
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: "https://admin.shopify.com/store/dev-demosky/apps/faq_app-8/pagename",
//       cancel_url: "https://admin.shopify.com/store/dev-demosky/apps/faq_app-8/Priceing",
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     res.status(500).json({ error: "An error occurred while processing your request. Please try again later." });
//   }
// });

//  ********** subscription api **********
app.post("/create-stripe-session-subscription",express.json(),
    async (req, res) => {
      const shoname = req.body.shoname;
      console.log(shoname);
        console.log(req.body.email, req.body.planname);
        const userEmail = req.body.email; // Replace with actual user email
        let customer;
        const auth0UserId = userEmail;
        let session; // Declare session variable here
      
        const existingCustomers = await stripe.customers.list({
          email: userEmail,
          limit: 1,
        });

      // console.log(existingCustomers.data[0].metadata.interval)
        if (existingCustomers.data.length > 0) {
          customer = existingCustomers.data[0];
      
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: "active",
            limit: 1,
          });
      
          if (subscriptions.data.length > 0 && req.body.interval != "trial") {
            const stripeSession = await stripe.billingPortal.sessions.create({
              customer: customer.id,
              return_url: `https://admin.shopify.com/store/${shoname}/apps/faq_app-8/`,
            });
            return res.status(409).json({ redirectUrl: stripeSession.return_url });
          }
        } else {
          // No customer found, create a new one
          customer = await stripe.customers.create({
            email: userEmail,
            metadata: {
              userId: auth0UserId,
            },
          });
        }
      
        // Now create the Stripe checkout session with the customer ID
        if (req.body.interval === "trial") {
          console.log("hello");
          session = await stripe.checkout.sessions.create({
            success_url:
            `https://admin.shopify.com/store/${shoname}/apps/faq_app-8/`,
            cancel_url:
            `https://admin.shopify.com/store/${shoname}/apps/faq_app-8/Priceing`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            line_items: [
              {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: req.body.planname,
                    description: "Free Trial",
                  },
                  unit_amount: 0,
                  recurring: { interval: "day", interval_count: 7 },
                },
                quantity: 1,
              },
            ],
            metadata: {
              interval: req.body.interval
            },
            customer_email: userEmail,
          });
        }  else {

          session = await stripe.checkout.sessions.create({
            success_url:
            `https://admin.shopify.com/store/${shoname}/apps/faq_app-8/`,
            cancel_url:
            `https://admin.shopify.com/store/${shoname}/apps/faq_app-8/Priceing`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            line_items: [
              {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: req.body.planname,
                    description:
                      req.body.interval === "month"
                        ? "Monthly Subscription"
                        : "Yearly Subscription",
                  },
                  unit_amount: req.body.interval === "month" ? 20000 : 5000000,
                  recurring: {
                    interval: req.body.interval,
                    interval_count:1,
                  },
                },
                quantity: 1,
              },
            ],
            metadata: {
              userId: auth0UserId,
              interval: req.body.interval
            },
            customer: customer.id,
          });
        }
        res.json({ id: session.id });

      }
)


// ********* webhook api *******
let endpointSecret="whsec_b5782e268ecbdea35f1b59cf4a54c7c7d095d1119cda7c397ce0ed6f49fd53cd"
app.post("/webhook",bodyParser.raw({ type: "application/json" }),async (req, res) => {
  
  const request=req.body;
  const payload = request;
  const sig = req.headers["stripe-signature"];
  let event;
  // console.log(payload, sig, endpointSecret)
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    // Log the error
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;

    // On payment successful, get subscription and customer details
    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription,
      console.log(event.data.object.subscription)
    );
    const customer = await stripe.customers.retrieve(
      event.data.object.customer
    );


    if (invoice.billing_reason === "subscription_create") {

      const subscriptionDocument = {
        userId: customer?.metadata?.userId,
        subId: event.data.object.subscription,
        endDate: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
        // endDate: subscription.current_period_end * 1000,
      };
      console.log(subscriptionDocument);
    
      try {
        pool.query('INSERT INTO bill (userId, subId, endDate) VALUES (?, ?, ?)', [subscriptionDocument.userId, subscriptionDocument.subId, subscriptionDocument.endDate], (error, results, fields) => {
          if (error) {
            console.error("MySQL Insert Error:", error);
            return;
          }
          console.log("Successfully inserted the document into the collection");
        });
      } catch (err) {
        // Log the error
        console.log("error", err.message)
      }

      console.log(
        `First subscription payment successful for Invoice ID: ${customer.email} ${customer?.metadata?.userId}`
      );
    } else if (
      invoice.billing_reason === "subscription_cycle" ||
      invoice.billing_reason === "subscription_update"
    ) {
      // Handle recurring subscription payments
      // DB code to update the database for recurring subscription payments

      // Define the filter to find the document with the specified userId
      const userId = customer?.metadata?.userId;
  const endDate = subscription.current_period_end * 1000;


  try {
    pool.query(
      'UPDATE bill SET endDate = ?, recurringSuccessful_test = true WHERE userId = ?',
      [endDate, userId],
      (error, results, fields) => {
        if (error) {
          console.error("MySQL Update Error:", error);
          return;
        }
        if (results.affectedRows === 0) {
          console.log("No rows matched the query. Data not updated.");
        } else {
          console.log("Successfully updated the data.");
        }
      }
    )} catch (err) {
        // Log the error
        console.error("mysql Update Error:", err.message);
      }

    }

    console.log(
      new Date(subscription.current_period_end * 1000),
      subscription.status,
      invoice.billing_reason
    );
  }

  // For canceled/renewed subscription
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    // console.log(event);
    if (subscription.cancel_at_period_end) {
      console.log(`Subscription ${subscription.id} was canceled.`);
      // DB code to update the customer's subscription status in your database
    } else {
      console.log(`Subscription ${subscription.id} was restarted.`);
      // get subscription details and update the DB
    }
  }
  if(event.type === "customer.subscription.deleted"){
      const subscription = event.data.object;
      // console.log(subscription)
      }
  res.status(200).end();
})



// **** end subscription ******
app.get('/getsubscription', (req, res) => {
  const { email } = req.query;
  const sql = "SELECT * FROM `bill` WHERE `userId` = ?";

  console.log(email);
  db.query(sql, email, (err, data) => {
    if (err) {
      console.error("Error selecting data:", err);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    console.log("Data selected successfully");
    return res.json({ success: true, data });
  });
});


app.listen(process.env.APP_PORT, () => {

  console.log("Server up and running ON port : ", process.env.APP_PORT);
});
