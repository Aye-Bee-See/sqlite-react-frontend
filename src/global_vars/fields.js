var fields = {
  Prisoner: {
    id: {
      title: 'ID',
      type: 'number',
      default: -1,
      disabled: true,
    },
    chosenName: {
      title: 'Chosen Name',
      type: 'text',
      default: '',
    },
    birthName: {
      title: 'Birth Name',
      type: 'text',
      default: '',
      rules: 'required|string|between:3,50',
    },
    bio: {
      title: 'Bio',
      type: 'textarea',
      default: '',
      rules: 'required|string|between:3,1500',
    },
    prison: {
      title: 'Prison',
      type: 'select',
      default: -1,
      rules: 'required',
    },
    inmateID: {
      title: 'Inmate ID',
      type: 'text',
      default: '',
      rules: 'string',
    },
    releaseDate: {
      title: 'Release Date',
      type: 'date',
      default: '1999-09-09',
      rules: 'date',
    },
  },
  User: {
    id: {
      title: 'ID',
      type: 'number',
      default: '',
      disabled: true,
    },
    username: {
      title: 'Username',
      type: 'text',
      default: '',
      rules: 'required|string|between:3,20',
    },
    password: {
      title: 'Password',
      type: 'password',
      default: '',
      rules: 'required|string|between:8,60',
    },
    email: {
      title: 'Email',
      type: 'email',
      default: '',
      rules: 'email|between:5,30',
    },
    role: {
      title: 'Role',
      type: 'select',
      default: 'admin',
      rules: 'required|string|in:admin,user,banned',
    },
    name: {
      title: 'Name',
      type: 'text',
      default: '',
      rules: 'string',
    },
  },
  Prison: {
    id: {
      title: 'ID',
      type: 'number',
      default: null,
      disabled: true,
    },
    prisonName: {
      title: 'Prison Name',
      type: 'text',
      default: '',
      rules: 'required|string',
    },
    address: {
      meta: true,
      title: 'Address',
      subFields: {
        street: {
          title: 'Street',
          type: 'text',
          default: '',
          rules: 'string',
        },
        city: {
          title: 'City',
          type: 'text',
          default: '',
          rules: 'string',
        },
        state: {
          title: 'State',
          type: 'select',
          default: '',
          rules: 'string',
        },
        country: {
          title: 'Country',
          type: 'text',
          default: '',
          rules: 'string',
        },
      },
    },
  },
  Rule: {
    id: {
      title: 'ID',
      type: 'number',
      default: -1,
      disabled: true,
    },
    title: {
      title: 'Title',
      type: 'text',
      default: '',
      rules: 'required|string',
    },
    description: {
      title: 'Description',
      type: 'text',
      default: '',
      rules: 'string',
    },
  },
};

export default fields;
