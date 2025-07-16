# Convopal - WeChat Clone

A full-stack mobile messaging application built with React Native Expo (frontend) and Spring Boot (backend). This project serves as a learning platform for mobile app development, replicating core WeChat features.

## 🚀 Features

### Frontend (React Native + Expo)
- **Chat Interface**: Real-time messaging with message bubbles
- **Contacts Management**: User profiles, friend lists, and contact search
- **Discover Section**: Moments, QR scanning, shake to find users
- **Profile Management**: User settings, wallet, favorites
- **Modern UI**: WeChat-inspired design with smooth animations

### Backend (Spring Boot) - Coming Soon
- **User Authentication**: JWT-based login/registration
- **Real-time Messaging**: WebSocket support for instant messaging
- **File Management**: Image/video upload and storage
- **Database**: User data, messages, and relationships
- **API Endpoints**: RESTful services for mobile app

## 🛠️ Tech Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Screen navigation
- **Expo Vector Icons**: Icon library
- **React Native Safe Area**: Safe area handling

### Backend (Planned)
- **Spring Boot**: Java backend framework
- **Spring Security**: Authentication and authorization
- **Spring WebSocket**: Real-time communication
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **JWT**: Token-based authentication

## 📱 Screenshots

The app includes four main screens:
1. **Chats**: List of conversations with search functionality
2. **Contacts**: Friend list with alphabetical sections
3. **Discover**: Moments, scanning, and discovery features
4. **Me**: User profile and settings

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Convopal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on your phone

### Development Commands
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web browser
npm run lint       # Run ESLint
```

## 📚 Learning Roadmap

### Phase 1: Frontend Basics ✅
- [x] Project setup with Expo
- [x] Navigation structure
- [x] Basic UI components
- [x] Screen layouts

### Phase 2: Core Features (In Progress)
- [ ] Chat screen with message bubbles
- [ ] Real-time messaging UI
- [ ] Contact management
- [ ] User authentication screens

### Phase 3: Backend Development
- [ ] Spring Boot project setup
- [ ] User authentication API
- [ ] Database design and setup
- [ ] WebSocket implementation
- [ ] File upload service

### Phase 4: Integration
- [ ] Connect frontend to backend
- [ ] Real-time messaging
- [ ] Push notifications
- [ ] Image/video sharing

### Phase 5: Advanced Features
- [ ] Voice/video calls
- [ ] Moments (social feed)
- [ ] Mini programs
- [ ] Payment integration

## 🎯 Skills You'll Learn

### Mobile Development
- React Native fundamentals
- Cross-platform development
- Mobile UI/UX design
- State management
- Navigation patterns
- Performance optimization

### Backend Development
- Spring Boot framework
- RESTful API design
- Database design
- Authentication & authorization
- Real-time communication
- File handling

### DevOps & Tools
- Git version control
- Testing strategies
- Deployment processes
- Cloud platforms
- CI/CD pipelines

## 📁 Project Structure

```
Convopal/
├── app/                    # Main application screens
│   ├── _layout.tsx        # Root navigation layout
│   ├── index.tsx          # Chats screen
│   ├── contacts.tsx       # Contacts screen
│   ├── discover.tsx       # Discover screen
│   └── me.tsx            # Profile screen
├── assets/                # Static assets
├── components/            # Reusable components (to be added)
├── services/             # API services (to be added)
├── utils/                # Utility functions (to be added)
└── types/                # TypeScript type definitions (to be added)
```

## 🔧 Development Tips

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error handling

### UI/UX Guidelines
- Follow WeChat's design patterns
- Ensure accessibility
- Test on different screen sizes
- Optimize for performance

### Testing Strategy
- Unit tests for components
- Integration tests for API calls
- E2E tests for user flows
- Performance testing

## 🤝 Contributing

This is a learning project, but contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for educational purposes. WeChat is a trademark of Tencent.

## 🆘 Support

If you encounter any issues:
1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review React Native troubleshooting guides
3. Search existing issues
4. Create a new issue with detailed information

## 🎉 Next Steps

1. **Start with the basics**: Understand React Native and Expo
2. **Build incrementally**: Add features one by one
3. **Learn by doing**: Experiment with different approaches
4. **Join communities**: React Native and Spring Boot communities
5. **Build your portfolio**: Document your learning journey

Happy coding! 🚀
