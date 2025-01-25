import { useState } from "react"; // Importing the `useState` hook to manage component states.

const initialFriends = [
  // Initial data for friends, including id, name, profile image, and balance.
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7, // Negative balance indicates the user owes the friend.
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20, // Positive balance indicates the friend owes the user.
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0, // Zero balance means no debts between the user and the friend.
  },
];

function Button({ children, onClick }) {
  // Reusable button component for consistent button styling and behavior.
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  // Main application component to manage the overall state and render other components.
  const [friends, setFriends] = useState(initialFriends); // State to store the list of friends.
  const [showAddFriend, setShowAddFriend] = useState(false); // State to toggle the "Add Friend" form visibility.
  const [selectedFriend, setSelectedFriend] = useState(null); // State to store the currently selected friend.

  function handleShowAddFriend() {
    // Toggles the visibility of the "Add Friend" form.
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    // Adds a new friend to the list and hides the form after submission.
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // Handles friend selection/deselection.
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false); // Ensures the "Add Friend" form is hidden when a friend is selected.
  }

  function handleSplitBill(value) {
    // Updates the selected friend's balance based on the split bill value.
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null); // Resets the selection after splitting the bill.
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends} // Passes the list of friends to the FriendsList component.
          selectedFriend={selectedFriend} // Passes the currently selected friend.
          onSelection={handleSelection} // Passes the friend selection handler.
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}{" "}
        {/*
        Renders the "Add Friend" form conditionally.*/}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}{" "}
          {/* Toggles the button text
          based on form visibility.*/}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend} // Passes the selected friend details.
          onSplitBill={handleSplitBill} // Passes the split bill handler.
          key={selectedFriend.id} // Ensures the form re-renders for each selected friend.
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  {
    /*prop*/
    /* Renders the list of friends and highlights the selected one.*/
  }
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend} // Passes individual friend details.
          key={friend.id}
          selectedFriend={selectedFriend} // Highlights the currently selected friend.
          onSelection={onSelection} // Passes the selection handler.
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  // Individual friend component with selection and balance display logic.
  const isSelected = selectedFriend?.id === friend.id; // Checks if the friend is currently selected.

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />{" "}
      {/* Displays the friend's profile picture. */}
      <h3>{friend.name}</h3> {/* Displays the friend's name. */}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€{" "}
          {/* Shows debt if balance is negative. */}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€{" "}
          {/* Shows credit if balance is positive. */}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}{" "}
      {/* Shows equality if balance is zero. */}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}{" "}
        {/* Toggles the button text based on selection. */}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  // Form for adding a new friend.
  const [name, setName] = useState(""); // State for the friend's name.
  const [image, setImage] = useState("https://i.pravatar.cc/48"); // Default state for the friend's image.

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return; // Prevents submission if either field is empty.

    const id = crypto.randomUUID(); // Generates a unique ID for the new friend.
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`, // Appends a unique identifier to the image URL.
      balance: 0, // Sets  the initial balance to 0.
    };

    onAddFriend(newFriend); // Adds the new friend to the list.

    setName(""); // Resets the name field.
    setImage("https://i.pravatar.cc/48"); // Resets the image URL to the default.
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button> {/* Button to submit the form. */}
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  // Form for splitting a bill with the selected friend.
  const [bill, setBill] = useState(""); // State for the total bill value.
  const [paidByUser, setPaidByUser] = useState(""); // State for the amount paid by the user.
  const paidByFriend = bill ? bill - paidByUser : ""; // Calculates the friend's share.
  const [whoIsPaying, setWhoIsPaying] = useState("user"); // State for the payer (user or friend).

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return; // Prevents submission if fields are empty.

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser); // Updates the balance based on who paid.
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button> {/* Button to submit the form. */}
    </form>
  );
}
