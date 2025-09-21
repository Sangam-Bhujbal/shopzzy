# E-Commerce Store

A modern, responsive e-commerce website built with HTML, CSS, JavaScript, and PHP. This project includes a complete online shopping platform with features like product catalog, shopping cart, user authentication, payment integration, and admin panel.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with support for all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Product Catalog**: Browse products with filtering and sorting options
- **Shopping Cart**: Add, remove, and manage cart items
- **Wishlist**: Save favorite products for later
- **User Authentication**: Login, register, and profile management
- **Search**: Advanced search with autocomplete and filters
- **Product Reviews**: Rate and review products
- **Newsletter Subscription**: Email subscription system
- **Carousel/Slider**: Hero banners and product showcases

### Backend Features
- **User Management**: Registration, login, password reset
- **Product Management**: CRUD operations for products
- **Order Management**: Order processing and tracking
- **Inventory Management**: Stock tracking and alerts
- **Payment Integration**: Multiple payment gateways
- **Admin Dashboard**: Complete admin panel
- **Analytics**: Sales and user analytics
- **Email Notifications**: Order confirmations and updates
- **Security**: CSRF protection, input validation, secure sessions

### Technical Features
- **Modern Stack**: HTML5, CSS3, JavaScript ES6+, PHP 7.4+
- **Database**: MySQL with optimized queries
- **Caching**: File-based caching system
- **File Uploads**: Image upload and management
- **SEO Optimized**: Meta tags, structured data
- **Performance**: Optimized images, lazy loading
- **Accessibility**: WCAG 2.1 compliant
- **Security**: Secure coding practices

## 📋 Requirements

- **Web Server**: Apache/Nginx with PHP support
- **PHP Version**: 7.4 or higher
- **Database**: MySQL 5.7 or higher
- **Extensions**: PDO, cURL, GD/ImageMagick, mbstring
- **Web Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation

### 1. Clone or Download
```bash
# Clone the repository
git clone https://github.com/yourusername/ecommerce-store.git
cd ecommerce-store

# Or download and extract the ZIP file
```

### 2. Database Setup
1. Create a MySQL database
2. Import the database schema:
```bash
mysql -u username -p database_name < sql/db_dump.sql
```

3. Update database configuration in `includes/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'your_database_name');
```

### 3. File Permissions
Set proper permissions for directories:
```bash
# Uploads directory
chmod 755 uploads/
chmod 755 cache/
chmod 755 logs/
```

### 4. Web Server Configuration
- Point your web server to the `ecommerce` directory
- Enable URL rewriting (mod_rewrite for Apache)
- Set proper document root

### 5. Email Configuration (Optional)
Update email settings in `includes/config.php`:
```php
public static $smtpHost = 'smtp.gmail.com';
public static $smtpUsername = 'your-email@gmail.com';
public static $smtpPassword = 'your-app-password';
```

## 📁 Project Structure

```
ecommerce/
├── index.html              # Homepage
├── assets/                 # Static assets
│   ├── css/               # Stylesheets
│   │   ├── style.css      # Main styles
│   │   ├── components.css # Component styles
│   │   └── responsive.css # Responsive styles
│   ├── js/                # JavaScript files
│   │   ├── main.js        # Main functionality
│   │   ├── carousel.js    # Carousel component
│   │   ├── search.js      # Search functionality
│   │   ├── dark-mode.js   # Dark mode toggle
│   │   └── products.js    # Product management
│   └── images/            # Image assets
├── includes/              # PHP includes
│   ├── config.php         # Configuration file
│   ├── functions.php      # Helper functions
│   ├── database.php       # Database functions
│   └── auth.php          # Authentication functions
├── sql/                   # Database files
│   └── db_dump.sql        # Database schema and sample data
├── uploads/               # File uploads
├── cache/                 # Cache files
├── logs/                  # Log files
├── admin/                 # Admin panel
├── api/                   # API endpoints
├── products/              # Product pages
├── cart/                  # Shopping cart
├── checkout/              # Checkout process
├── user/                  # User account pages
└── README.md              # This file
```

## 🎨 Customization

### Styling
- Modify `assets/css/style.css` for main styles
- Update `assets/css/components.css` for component styles
- Customize `assets/css/responsive.css` for mobile styles

### Branding
- Update site name and logo in `includes/config.php`
- Modify color scheme in CSS custom properties
- Add your logo to `assets/images/`

### Products
- Add products via admin panel
- Modify product categories in database
- Update product images in `uploads/`

## 🔧 Configuration

### Site Settings
Edit `includes/config.php` to configure:
- Database connection
- Site information
- Email settings
- File upload settings
- Security settings

### Admin Access
Default admin credentials:
- Email: admin@example.com
- Password: Admin@12345

⚠️ **Change these credentials immediately after installation!**

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

- CSRF protection
- SQL injection prevention
- XSS protection
- Secure password hashing
- Session management
- Input validation
- File upload security
- Rate limiting

## 🚀 Deployment

### Production Checklist
- [ ] Change default admin password
- [ ] Update database credentials
- [ ] Configure email settings
- [ ] Set proper file permissions
- [ ] Enable HTTPS
- [ ] Configure caching
- [ ] Set up backups
- [ ] Test all functionality

### Performance Optimization
- Enable browser caching
- Optimize images
- Minify CSS and JavaScript
- Use CDN for static assets
- Enable GZIP compression
- Database query optimization

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Check database credentials in `config.php`
- Ensure MySQL service is running
- Verify database exists and user has permissions

**File Upload Issues**
- Check file permissions on `uploads/` directory
- Verify PHP upload limits
- Check for sufficient disk space

**Email Not Sending**
- Verify SMTP settings in `config.php`
- Check spam folder
- Test with different email providers

**JavaScript Errors**
- Check browser console for errors
- Verify all JavaScript files are loading
- Check for JavaScript conflicts

## 📞 Support

For support and questions:
- Check the troubleshooting section above
- Review the code comments
- Check browser console for JavaScript errors
- Verify PHP error logs

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📈 Changelog

### Version 1.0.0
- Initial release
- Complete e-commerce functionality
- Responsive design
- Admin panel
- Payment integration ready

## 🙏 Acknowledgments

- Icons: Font Awesome
- Fonts: Inter (Google Fonts)
- Images: Placeholder images for demo
- Libraries: jQuery, Bootstrap components

---

**Note**: This is a demo e-commerce store. For production use, ensure proper security measures, payment gateway integration, and legal compliance.
