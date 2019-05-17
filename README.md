E-commerce Express API

[Check out front-end repo's README for more information](https://github.com/team-kray/e-commerce-client)

Database is deployed at https://hidden-tor-37672.herokuapp.com/

## Planning

[ERD!](https://i.imgur.com/1JQanwT.png)

### Routes

POST /sign-up users#signup
POST /sign-in users#signin
DELETE /sign-out users#sign-out
PATCH /change-password users#changepw

GET /products products#index
GET /products/:id products#show (related to stretch goal)

POST /orders orders#create
GET /orders orders#index
PATCH /orders/:id orders#update

## Try it out!

### [You can visit the deployed app here!](https://team-kray.github.io/e-commerce-client/)
Please do not submit real credit card information through the app. Instead, use the following test card number, a valid expiration date in the future, and any random CVC number, to create a successful payment: 4242 4242 4242 4242

### [The deployed Heroku database lives here](https://hidden-tor-37672.herokuapp.com/)

### [Check out our front-end repo here](https://github.com/team-kray/e-commerce-api)
