// // Import Sequelize library and connection
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize({
//   // Your database connection options
// });

// // Define Author model
// const Author = sequelize.define('author', {
//   author_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   author_name: {
//     type: DataTypes.STRING(255),
//     allowNull: false
//   }
// });

// // Define Publisher model
// const Publisher = sequelize.define('publisher', {
//   publisher_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   publisher_name: {
//     type: DataTypes.STRING(255),
//     allowNull: false
//   }
// });

// // Define Category model
// const Category = sequelize.define('category', {
//   category_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   category_name: {
//     type: DataTypes.STRING(255),
//     allowNull: false
//   }
// });

// // Define Book model
// const Book = sequelize.define('book', {
//   book_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   title: {
//     type: DataTypes.STRING(255),
//     allowNull: false
//   },
//   author_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Author,
//       key: 'author_id'
//     }
//   },
//   publisher_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Publisher,
//       key: 'publisher_id'
//     }
//   },
//   category_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Category,
//       key: 'category_id'
//     }
//   },
//   description: DataTypes.TEXT,
//   publication_year: DataTypes.INTEGER,
//   pages: DataTypes.INTEGER,
//   isbn: {
//     type: DataTypes.STRING(20),
//     unique: true
//   }
// });

// // Define BookCopy model
// const BookCopy = sequelize.define('book_copy', {
//   copy_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   book_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Book,
//       key: 'book_id'
//     }
//   },
//   copy_number: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   status: {
//     type: DataTypes.ENUM('Available', 'Borrowed', 'Reserved'),
//     defaultValue: 'Available'
//   }
// });

// // Define Users model
// const Users = sequelize.define('users', {
//   member_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   name: {
//     type: DataTypes.STRING(50),
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING(30),
//     allowNull: false,
//     unique: true
//   },
//   password: DataTypes.STRING(30),
//   member_role: {
//     type: DataTypes.STRING(50),
//     allowNull: false
//   }
// });

// // Define LibraryAccount model
// const LibraryAccount = sequelize.define('library_account', {
//   account_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   member_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     unique: true,
//     references: {
//       model: Users,
//       key: 'member_id'
//     }
//   },
//   card_number: {
//     type: DataTypes.STRING(50),
//     allowNull: false
//   },
//   reserve_book: DataTypes.BOOLEAN,
//   return_book: DataTypes.BOOLEAN,
//   renew_book: DataTypes.BOOLEAN,
//   num_checked_out_books: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
//   },
//   fines_to_pay: {
//     type: DataTypes.DECIMAL(10, 2),
//     defaultValue: 0.00
//   },
//   make_payment: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
//   },
//   registration_date: {
//     type: DataTypes.DATE,
//     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//   }
// });

// // Define Holds model
// const Holds = sequelize.define('holds', {
//   hold_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   book_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Book,
//       key: 'book_id'
//     }
//   },
//   member_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Users,
//       key: 'member_id'
//     }
//   },
//   hold_date: {
//     type: DataTypes.DATE,
//     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//   },
//   expiry_date: DataTypes.DATE
// });

// // Define LibraryStaff model
// const LibraryStaff = sequelize.define('library_staff', {
//   staff_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   name: {
//     type: DataTypes.STRING(50),
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING(30),
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: DataTypes.STRING(30),
//     allowNull: false
//   },
//   role: {
//     type: DataTypes.STRING(50),
//     allowNull: false
//   }
// });

// // Define Reports model
// const Reports = sequelize.define('reports', {
//   report_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   report_name: {
//     type: DataTypes.STRING(60),
//     allowNull: false
//   },
//   description: DataTypes.TEXT,
//   generation_date: {
//     type: DataTypes.DATE,
//     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//   },
//   generated_by: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: LibraryStaff,
//       key: 'staff_id'
//     }
//   }
// });

// // Define Fine model
// const Fine = sequelize.define('fine', {
//   fine_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   amount: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   },
//   reason: DataTypes.TEXT,
//   member_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Users,
//       key: 'member_id'
//     }
//   },
//   transaction_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Transaction,
//       key: 'transaction_id'
//     }
//   }
// });

// // Define Transaction model // Assuming you have configured Sequelize
// const Transaction = sequelize.define('Transaction', {
//     transaction_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     member_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'Users',
//             key: 'member_id'
//         }
//     },
//     copy_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'BookCopy',
//             key: 'copy_id'
//         },
//         onDelete: 'CASCADE'
//     },
//     transaction_type: {
//         type: DataTypes.STRING(50),
//         allowNull: false
//     },
//     transaction_date: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     },
//     due_date: {
//         type: DataTypes.DATE
//     },
//     issued_by: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'LibraryStaff',
//             key: 'staff_id'
//         }
//     },
//     automated_transaction: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     },
//     automated_system: {
//         type: DataTypes.STRING(100)
//     },
//     fine_id: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'Fine',
//             key: 'fine_id'
//         }
//     }
// });

// // Define associations between Author and Book (One-to-Many)
// Author.hasMany(Book, { foreignKey: 'author_id' });
// Book.belongsTo(Author, { foreignKey: 'author_id' });

// // Define associations between Publisher and Book (One-to-Many)
// Publisher.hasMany(Book, { foreignKey: 'publisher_id' });
// Book.belongsTo(Publisher, { foreignKey: 'publisher_id' });

// // Define associations between Category and Book (One-to-Many)
// Category.hasMany(Book, { foreignKey: 'category_id' });
// Book.belongsTo(Category, { foreignKey: 'category_id' });

// // Define associations between Book and BookCopy (One-to-Many)
// Book.hasMany(BookCopy, { foreignKey: 'book_id' });
// BookCopy.belongsTo(Book, { foreignKey: 'book_id' });

// // Define associations between Users and LibraryAccount (One-to-One)
// Users.hasOne(LibraryAccount, { foreignKey: 'member_id' });
// LibraryAccount.belongsTo(Users, { foreignKey: 'member_id' });

// // Define associations between Book and Holds (One-to-Many)
// Book.hasMany(Holds, { foreignKey: 'book_id' });
// Holds.belongsTo(Book, { foreignKey: 'book_id' });

// // Define associations between Users and Holds (One-to-Many)
// Users.hasMany(Holds, { foreignKey: 'member_id' });
// Holds.belongsTo(Users, { foreignKey: 'member_id' });

// // Define associations between Users and Fine (One-to-Many)
// Users.hasMany(Fine, { foreignKey: 'member_id' });
// Fine.belongsTo(Users, { foreignKey: 'member_id' });

// // Define associations between Transaction and Fine (One-to-One)
// Transaction.hasOne(Fine, { foreignKey: 'transaction_id' });
// Fine.belongsTo(Transaction, { foreignKey: 'transaction_id' });

// // Define associations between Users and Transaction (One-to-Many)
// Users.hasMany(Transaction, { foreignKey: 'member_id' });
// Transaction.belongsTo(Users, { foreignKey: 'member_id' });

// // Define associations between LibraryStaff and Reports (One-to-Many)
// LibraryStaff.hasMany(Reports, { foreignKey: 'generated_by' });
// Reports.belongsTo(LibraryStaff, { foreignKey: 'generated_by' });

// module.exports = Transaction;