const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const theme = require('admin-bro-theme-dark')

require('dotenv').config()

const express = require('express')
const app = express()

app.use(bodyParser.json())

AdminBro.registerAdapter(AdminBroMongoose)

const BlogSchema = new mongoose.Schema({ 
tittle: { 
    type: String,
    required: true
},
desc: { 
    type: String,
    required: true
},
slug: { 
    type: String,
    required: true,
    unique: true
},
createdat: {
     type: String,
     default: new Date().toString().substring(0, 21)
},
updatedat: {
	 type: String,
     default: new Date().toString().substring(0, 21)
},
thumbnail: {
	 type: String,
     required: true
},
author: {
	 type: String,
     required: true
},
content: {
	 type: String,
     required: true
},
authorpic: {
	 type: String,
     required: true
},
topic: {
	 type: String,
     required: true
}
})

const ReqBlogSchema = new mongoose.Schema({

author: {
    type: String,
    required: true,
},
email: {
	type: String,
	required: true
},
tittle: {
    type: String,
    required: true
},
desc: {
    type: String,
    required: true
},
thumbnail: {
     type: String,
     required: true
},
content: {
    type: String,
    required: true
},
specialmessage: {
	type: String,
},
createdat: {
     type: String,
     required: true,
     default: new Date().toString().substring(0, 21)
},

})

const ContactSchema = new mongoose.Schema({
name: {
	type: String,
	required: true
},
email: {
	type: String,
	required: true
},
message: {
	type: String,
	required: true
},
date: {
	type: String,
	required: true,
	default: new Date().toString().substring(0, 21)
}

})


const AllBlogs = mongoose.model("blogs" , BlogSchema )
const ReqBlogs = mongoose.model("reqblogs" , ReqBlogSchema )
const Contacts = mongoose.model("contact" , ContactSchema ,"contact" )

const run = async () => {
  const mongooseDb = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

  // Passing resources by giving entire database
  const adminBro = new AdminBro({
    databases: [mongooseDb],
    //... other AdminBroOptions
  })
  app.post('/contact', (req,res)=> {
    const request = new Contacts({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
    })
    request.save()
    res.redirect('https://imagiweb.tech/contact')
})

app.post('/write-a-blog', (req,res)=> {
    const requ = {
    author: req.body.author,
    email: req.body.email,
    tittle: req.body.tittle,
    desc: req.body.desc,
    thumbnail: req.body.thumbnail,
    content: req.body.content,
    }
    if (req.body.specialmessage) {
    	requ.specialmessage = req.body.specialmessage
    }
    const request = ReqBlogs(req)
    request.save()
    res.redirect('https://imagiweb.tech/write-a-blog')
})

}

run()  
  
const adminBro = new AdminBro({
  branding: {
    companyName: 'ImagiWeb - Admin',
    theme,
    softwareBrothers: false,
    logo: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1667702492769/n_kcmkrNc.jpg',
  },
  resources: [ { resource: AllBlogs, options: { 
  properties: {desc: { type: 'textarea' } , content: { type: 'textarea' } , createdat: { type: 'datetime' , isVisible: { edit: false , list: true, filter: true, show: true} } , updatedat: { type: 'datetime' , isVisible: { edit: true , list: true, filter: true , show: true }}
  }}},
  { resource: Contacts, options: {
   properties: {date: { type: 'datetime' , isVisible: { edit: false , list: true, filter: true, show: true} } , name: { isVisible: { edit: false , list: true, filter: true, show: true}} , email: { isVisible: { edit: false , list: true, filter: true, show: true}} , message: { isVisible: { edit: false , list: true, filter: true, show: true}}}}},
  ReqBlogs
],
  rootPath: '/admin',
})
const user = {
email : process.env.EMAIL,
password : process.env.PASSWORD
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if ( email === user.email && password === user.password) {
          return user 
      }
    else {
    	return false
    	}
     },
 cookiePassword: 'session Key',
})


app.use(adminBro.options.rootPath, router)
app.listen(process.env.PORT || 8080, () => console.log('AdminBro is under localhost:8080/admin'))

