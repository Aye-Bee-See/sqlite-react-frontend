// TODO: Add validation for subjects beyond Prisoner

var fields = {
  Prisoner: {
    id: {
      title: "ID",
      type: 'number',
      default: null,
      disabled: true,
    },
    chosenName: {
     title: "Chosen Name",
     type: "text",
     default: '',
    },
    birthName: {
     title: "Birth Name",
     type: "text",
     default: '',
     rules: 'required|string|between:3,50'
   },
   bio: {
     title: "Bio",
     type: "textarea",
     default: '',
     rules: 'required|string|between:3,1500'
   },
   prison: {
     title: "Prison",
     type: "select",
     default: null,
     rules: 'required'
   },
   inmateID: {
     title: "Inmate ID",
     type: "text",
     default: '',
   },
   releaseDate: {
     title: "Release Date",
     type: "date",
     default: '1999-09-09' 
   }
 },
 User: {
  id: {
    title: "ID",
    type: 'number',
    default: '',
    disabled: true,
  },
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
    default: ''
  }
 },
 Prison: {
  id: { title: "ID",
        type: "number",
        default: null,
        disabled: true
  },
  prisonName: { title: "Prison Name",
                type: "text",
                default: ""
  },
  address: {
    meta: true,
    title: 'Address',
    subFields: {
      street: {
        title: "Street",
        type: "text",
        default: ""
      },
      city: {
        title: "City",
        type: "text",
        default: ""
      },
      state: {
        title: "State",
        type: "select",
        default: ""
      },
      country: {
        title: "Country",
        type: "text",
        default: ""
      },
    }
  }
 },
 Rule: {
  id: { title: "ID",
        type: "number",
        default: -1,
        disabled: true
  },
  title: {
        title: "Title",
        type: "text",
        default: ""
  },
  description: {
    title: "Description",
    type: "text",
    default: ""
  }
 }
}

export default fields;