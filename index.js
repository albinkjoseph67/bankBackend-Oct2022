// Import express inside index.js

const express = require('express')

// import cors in index.js
const cors = require('cors')

// import dataservice
const dataservice = require('./services/dataService')

// import jsonwebtoken
const jwt = require('jsonwebtoken')


// Create server app using express
const server = express()

// use cors to define orgin
server.use(cors({
    origin:'http://localhost:4200'
}))

// to parse json data
server.use(express.json())


// Set up port for server app

server.listen(3000,()=>{
    console.log('Server started at 3000');
})

// application specific Middleware
const appMiddleware = (req,res,next)=>{
    console.log('Inside application specific Middleware');
    next()
}
server.use(appMiddleware)



// bankapp front end  request resolving

// token verify middleware
const jwtMiddleware = (req,res,next)=>{
    console.log('Inside router specific middleware');
    // get token from req headers
    const token = req.headers['access-token']
    try{
        // verify token
        const data=jwt.verify(token,'secretwizard123')
        console.log(data);
        req.fromAcno=data.currentAcno

        console.log('Valid Token');
        

        next()
    }
    catch{
        console.log('Invalid Token');
        res.status(401).json({
            message:'Please Login !!'
        })

    }
}

// register api call resolving
server.post('/register',(req,res)=>{
    console.log('inside register Api');
    console.log(req.body);
    // asynchronous
    dataservice.register(req.body.uname,req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)

    })
   
})

// login api call resolving
server.post('/login',(req,res)=>{
    console.log('inside login Api');
    console.log(req.body);
    // asynchronous
    dataservice.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)

    })
   
})

// getBalance Api
server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside getBalance api');
    console.log(req.params.acno);
    // asynchronous
    dataservice.getBalance(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)

    })
   
})
// deposit Api
server.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('Inside deposit api');
    console.log(req.body);
    // asynchronous
    dataservice.deposit(req.body.acno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)

    })
   
})

// fundTransfer Api
server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
    console.log('Inside fundTransfer api');
    console.log(req.body);
    // asynchronous
    dataservice.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)

    })
   
})

// getAllTransactions
server.get('/all-transactions',jwtMiddleware,(req,res)=>{
    console.log('Inside getAllTransactions api');
    dataservice.getAllTransactions(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })

})

// delete-account api
server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside delete-account api');
    console.log(req.params.acno);
    // asynchronous
    dataservice.deleteMyAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)

    })
   
})