 var fields = {
  Prisoner: {
    chosenName: {
     title: "Chosen Name",
     type: "text",
     default: ''
    },
    birthName: {
     title: "Birth Name",
     type: "text",
     default: ''
   },
   bio: {
     title: "Bio",
     type: "textarea",
     default: ''
   },
   prison: {
     title: "Prison",
     type: "select",
     default: 1
   },
   inmateID: {
     title: "Inmate ID",
     type: "text",
     default: -1
   },
   releaseDate: {
     title: "Release Date",
     type: "date",
     default: '1999-09-09' 
   }
 },
 User: {
  username: {
    title: "Username",
    type: "text",
    default: ''
  },
  password: {
    title: "Password",
    type: "password",
    default: ''
  },
  email: {
    title: "Email",
    type: "email",
    default: ''
  },
  role: {
    title: "Role",
    type: "select",
    default: 'admin',
  },
  name: {
    title: "Name",
    type: "text",
    default: 'admin'
  }
 }
}

export default fields;