import mongoose from 'mongoose';

const ADMIN_EMAILS = [
  'rafaelhoffmann@gmail.com',
  'samuelcunha@gmail.com'
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    // 🟢 Novo campo de banimento dentro do próprio User
    isBanned: {
      type: Boolean,
      default: false
    },
    banReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Hook para atribuir role de admin automaticamente
userSchema.pre('save', function () {
  if (ADMIN_EMAILS.includes(this.email.toLowerCase())) {
    this.role = 'admin';
  }
});

const User = mongoose.model('User', userSchema);

export const seedInitialUsers = async () => {
  try {
    const initialUsers = [
      {
        name: 'Rafael Hoffmann',
        email: 'rafaelhoffmann@gmail.com',
        password: 'Hoff123',
        role: 'admin'
      },
      {
        name: 'Samuel Cunha',
        email: 'samuelcunha@gmail.com',
        password: 'Cunha123',
        role: 'admin'
      }
    ];

    for (const userData of initialUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`👤 Usuário inicial criado: ${userData.name}`);
      }
    }
  } catch (error) {
    console.error('Erro ao popular usuários iniciais:', error.message);
  }
};

export default User;