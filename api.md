# Split Expense API
// Maintain the integrity in the naming conventions and the structure of the API documentation. Ensure that all endpoints are clearly defined with their respective request and response formats. Include any necessary authentication details and error handling mechanisms for a comprehensive API documentation.
## Schema

### User Schema
```json
{
    phone: {
        type: String,
        required: true,
        unique: true
    },
    upi: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }]
}
```

### Group Schema
```json
{
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        upi: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        balances: [{
            upi: {
                type: String,
                required: true,
                trim: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            },
            amount: {
                type: Number,
                default: 0
            }
        }],
        total: {
            type: Number,
            default: 0
        }
    }],
    createdBy: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
}
```

### Transaction Schema
```json
{
    by: {
        type: String,
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    splits: [{
        to: {
            upi: String,
            name: String
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    desc: {
        type: String,
        required: true,
        trim: true
    }
}
```

# API Endpoints

## User

### Register a User
**Endpoint:** `POST /register`
**Request Body:**
```json
{
  "phone": "1234567890",
  "upi": "user1@upi",
  "name": "User One",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "User created successfully",
  "status": true
}
```

### Login a User
**Endpoint:** `POST /login`
**Request Body:**
```json
{
  "phone": "1234567890",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "status": true
}
```

### Get User Profile
**Endpoint:** `GET /profile`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Response:**
```json
{
  "phone": "1234567890",
  "upi": "user1@upi",
  "name": "User One",
  "groups": [
    {
      "code": "123456",
      "name": "Friends Group"
    }
  ],
  "status": true
}
```

### Update User Profile
**Endpoint:** `PUT /profile`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "name": "User One Updated"
}
```
**Response:**
```json
{
  "message": "Profile updated successfully",
  "status": true
}
```

### Get User's Name with UPI
**Endpoint:** `GET /:upi/name`
**Response:**
```json
{
  "name": "User One",
  "status": true
}
```

### Get User's Name and UPI with Phone Number
**Endpoint:** `GET /:phone`
**Response:**
```json
{
  "name": "User One",
  "upi": "user1@upi",
  "status": true
}
```

### Get User Groups
**Endpoint:** `GET /group/getall`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Response:**
```json
{
  "groups": [
    {
      "name": "Friends Group",
      "createdBy": "Name",
      "receiveableamount": 150.00,
      "payableamount": 50.00,
      "totalMembers": 5,
      "groupCode": "123456"
    }
  ],
  "status": true
}
```

### Change Password
**Endpoint:** `POST /change-password`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```
**Response:**
```json
{
  "message": "Password changed successfully",
  "status": true
}
```

## Group
### Create a Group

**Endpoint:** `POST /group/create`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "name": "Friends Group",
  "members": [
    { "upi": "user1@upi", "name": "User One"},
    { "upi": "user2@upi", "name": "User Two"},
    { "upi": "user3@upi", "name": "User Three"}
  ],
  "createdBy": "user1@upi"
}
```
**Response:**
```json
{
  "message": "Group created successfully",
  "code": "123456",
  "status": true
}
```

### Get Group Details
**Endpoint:** `GET /group/:groupId`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Response:**
```json
{
  "code": "000001",
  "name": "Friends Group",
  "members": [
    {"upi": "user1@upi", "amount": 300},
    { "upi": "user2@upi", "amount": 100},
    { "upi": "user3@upi", "amount": 200}
  ],
  "createdBy": "user1@upi",
  "status": true
}
```

### Add a new member to the group
**Endpoint:** `POST /group/:groupId/member`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "groupId": "000001",
  "newMember": { "upi": "user4@upi", "name": "User Four"}
}
```
**Response:**
```json
{
  "message": "Members added successfully",
  "members": [
    {"upi": "user1@upi", "amount": 300},
    { "upi": "user2@upi", "amount": 100},
    { "upi": "user3@upi", "amount": 200},
    { "upi": "user4@upi", "amount": 0},
    { "upi": "user5@upi", "amount": 0}
  ],
  "status": true
}
```

### Join a Group
**Endpoint:** `POST /group/join`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "groupId": "000001"
}
```
**Response:**```json
{
  "message": "Joined group successfully",
  "status": true
}
```

### Leave a Group (Only if the member has zero balance)
**Endpoint:** `POST /group/leave`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "groupId": "000000"
}
```
**Response:**
```json
{
  "message": "Left group successfully",
  "status": true
}
```

## Transaction

### Add a Transaction
**Endpoint:** `POST /group/txn/add`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "groupId": "000001",
  "amount": 300,
  "desc": "Dinner",
  "splits": [
    {
      "to": "user2@upi",
      "amount": 100
    },
    {
      "to": "user3@upi",
      "amount": 200
    }
  ]
}
```
**Response:**
```json
{
  "message": "Transaction added successfully",
  "status": true
}
```

### Get Transactions of a Group in reverse chronological order
**Endpoint:** `GET /group/txn/:groupId`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Response:**
```json
{
  "transactions": [
    {
      "by": "user1@upi",
      "amount": 300,
      "desc": "Dinner",
      "date": "2024-06-01T12:00:00Z",
      "splits": [
        {
          "to": "user2@upi",
          "amount": 100
        },
        {
          "to": "user3@upi",
          "amount": 200
        }
      ]
    }
  ],
  "status": true
}
```

### Get User Transactions in a Group
**Endpoint:** `GET /group/txn/user/:groupId`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Response:**
```json
{
  "transactions": [
    {
      "by": "user1@upi",
      "amount": 300,
      "desc": "Dinner",
      "date": "2024-06-01T12:00:00Z",
      "splits": [
        {
          "to": "user2@upi",
          "amount": 100
        },
        {
          "to": "user3@upi",
          "amount": 200
        }
      ]
    }
  ],
  "status": true
}
```

### Edit a Transaction (Only the user who added the transaction can edit it)
**Endpoint:** `PUT /group/txn/edit/:txnId`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "amount": 350,
  "desc": "Dinner at restaurant",
  "splits": [
    {
      "to": "user2@upi",
      "amount": 150
    },
    {
      "to": "user3@upi",
      "amount": 200
    }
  ]
}
```
**Response:**
```json
{
  "message": "Transaction updated successfully",
  "status": true
}
```

### Settle a Transaction (Only the user who added the transaction can settle it)
**Endpoint:** `POST /group/txn/settle/:txnId`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Response:**
```json
{
  "message": "Transaction settled successfully",
  "status": true
}
```

### Revert a Transaction (Only the user who added the transaction can revert it and only if the transaction is not settled)
**Endpoint:** `POST /group/txn/revert/:txnId`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Response:**
```json
{
  "message": "Transaction reverted successfully",
  "status": true
}
```

# Recommended Final API Structure
## User
```
/user/signup
/user/login
/user/profile/:upi
/user/update
/user/delete
/user/groups/:upi
/user/password
/user/name/upi/:upi
/user/name/phone/:phone
```
## Group
```
/group/create
/group/join
/group/:groupId
/group/members/:groupId
/group/member
/group/leave
/group/:groupId
```
## Transaction
```
/txn/add
/txn/:groupId
/txn/single/:txnId
/txn/:txnId
/txn/user/:upi
/txn/balance/:groupId
/txn/settle
/txn/revert
```


## Future Scopes

### Remove a member from the group (Only if the member has zero balance)
**Endpoint:** `DELETE /group/member`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "groupId": "000001",
  "memberToRemove": "user2@upi"
}
```
**Response:**
```json
{
  "message": "Member removed successfully",
  "members": [
    {"upi": "user1@upi", "amount": 300},
    { "upi": "user3@upi", "amount": 200},
    { "upi": "user4@upi", "amount": 0},
    { "upi": "user5@upi", "amount": 0}
  ],
  "status": true
}
```

### Leave a Group (Only if the member has zero balance)
**Endpoint:** `POST /group/leave`
**Headers:**
```Authorization: Bearer <jwt_token>```
**Request Body:**
```json
{
  "groupId": "000001"
}
```
**Response:**```json
{
  "message": "Left group successfully",
  "status": true
}
```
