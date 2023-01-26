// import db.js
const db = require('./db')

// import Jsonwebtoken
const jwt = require('jsonwebtoken')

// register
const register =(uname,acno,pswd)=>{
    // check acno is in mongodb- db.users.findOne()
  return  db.User.findOne({
        acno
    }).then((result)=>{
console.log(result);
if(result){
    // acno already exists
    return{
        statusCode:403,
        message:'Account Already Exist!!'
    }
}else{
    // to add new user
    const newUser =new db.User({
       username:uname,
       acno,
       password:pswd,
       balance:0,
       transaction:[]
    })
    // to save new user in mongodb use save()
    newUser.save()
    return {
        statusCode:200,
        message:'Registration Successfull.....'
    }

}
    })

}

// login

const login = (acno,pswd)=>{
    console.log('Inside login function body');
// check acno,pswd in mongodb
return db.User.findOne({
    acno,
    password:pswd
}).then((result)=>{
    if(result){

        // generate token
        const token = jwt.sign({
            currentAcno:acno
        },'secretwizard123')
        return{
            statusCode:200,
        message:'Login Successfull.....',
        username:result.username,
        currentAcno:acno,
        token

        }
    }
    else{
        return{
            statusCode:404,
        message:'Invalid Account / Password'

        }

    }
})

}

// getBalance
const getBalance = (acno)=>{
   return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }else{
            return{
                statusCode:404,
            message:'Invalid Account'
    
            }
        }
    })

}
// deposit
const deposit= (acno,amt)=>{
    let amount=Number(amt)
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            // acno is present  db
            result.balance +=amount
            result.transaction.push({
                type:"CREDIT",
                fromAcno:acno,
                toAcno:acno,
                amount
            })
            // to update in Mongodb
            result.save()
            return{
                statusCode:200,
                message:`${amount} successfully deposited..`
            }
        }else{
            return{
                statusCode:404,
                message:'Invalid Acount'
            }
        }
    })
}
// fundTransfer 
const fundTransfer= (req,toAcno,pswd,amt)=>{
    let amount = Number(amt)
    let fromAcno=req.fromAcno
    return db.User.findOne({

        acno:fromAcno,
        password:pswd

    }).then(result=>{
        console.log(result);
        if(fromAcno==toAcno){
            return{
                statusCode:401,
                message:"Permission denied due to own account transfer!! "
            }
        }
        if(result){
// debit account details
let fromAcnoBalance = result.balance
         if(fromAcnoBalance>=amount){
            result.balance  = fromAcnoBalance -amount
            
            // credit account details
            return db.User.findOne({
                acno:toAcno
            }).then(creditdata=>{
                if(creditdata){
                    creditdata.balance +=amount
                    creditdata.transaction.push({
                        type:"CREDIT",
                        fromAcno,
                        toAcno,
                        amount
                    })

                    creditdata.save();
                    console.log(creditdata);
                    result.transaction.push({
                        type:"DEBIT",
                        fromAcno,
                        toAcno,
                        amount
                    })
                    result.save();
                    console.log(result);
                    return{
                        statusCode:200,
                        message:"Amount Transfer Successfully"
                    }

                }else{
                    return{
                        statusCode:401,
                        message:"Invalid credit Account number"
                    }
                }
            })


         }else{
            return{
                statusCode:403,
                message:"Insufficient balance"
            }
         }

        }else{
            return{
                statusCode:401,
                message:"Invalid Debit Account number / Password"
            }
        }
    })


}
// getAllTransactions
const getAllTransactions=(req)=>{
let acno = req.fromAcno
return db.User.findOne({
    acno
}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            transaction:result.transaction

        }

    }else{
        return{
            statusCode:401,
            message:"Invalid Debit Account number"
        }

    }
})
}

// deleteMyAccount
const deleteMyAccount=(acno)=>{
return db.User.deleteOne({
    acno
}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            message:"Account Deleted Successfully"
        }

    }
    else{
        return{
            statusCode:401,
            message:"Invalid Account"
        }

    }
})
}

// export 
module.exports={
    register,
    login,
    getBalance,
    deposit,
    fundTransfer,
    getAllTransactions,
    deleteMyAccount
    
}