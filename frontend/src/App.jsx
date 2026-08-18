import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("feed");
  const [loading, setLoading] = useState(true);

  async function loadCurrentUser() {
    try {
      const response = await fetch(`${API}/users/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      setUser(await response.json());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="screen-center">
        <div className="loader"></div>
        <p>Loading Interpersonal...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={loadCurrentUser} />;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="logo" onClick={() => setPage("feed")}>
            <span className="logo-mark">I</span>
            <span>Interpersonal</span>
          </button>

          <nav>
            <button
              className={page === "feed" ? "active" : ""}
              onClick={() => setPage("feed")}
            >
              Feed
            </button>

            <button
              className={page === "people" ? "active" : ""}
              onClick={() => setPage("people")}
            >
              People
            </button>

            <button
              className={page === "create" ? "active" : ""}
              onClick={() => setPage("create")}
            >
              Create Post
            </button>

            <button
              className={page === "profile" ? "active" : ""}
              onClick={() => setPage("profile")}
            >
              My Profile
            </button>
          </nav>

          <div className="top-user">
            <div className="mini-avatar">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            <div className="top-user-info">
              <strong>{user.name}</strong>
              <span>@{user.username}</span>
            </div>

            <button
              className="logout-button"
              onClick={() => logout(setUser)}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {page === "feed" && (
          <Feed
            user={user}
            goToCreate={() => setPage("create")}
          />
        )}

        {page === "people" && <People user={user} />}

        {page === "create" && (
          <CreatePost
            onCreated={() => setPage("profile")}
          />
        )}

        {page === "profile" && <Profile user={user} />}
      </main>
    </div>
  );
}


/* =========================
   LOGIN
========================= */

function LoginScreen({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <RegisterScreen
        onRegistered={() => setShowRegister(false)}
        onBack={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-mark large">I</span>
        </div>

        <h1>Interpersonal</h1>
        <p className="subtitle">Connect with your people.</p>

        <LoginForm onLogin={onLogin} />

        <div className="auth-switch">
          New here?
          <button onClick={() => setShowRegister(true)}>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}


function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        redirect: "manual",
        body,
      });

      if (
        response.status === 302 ||
        response.status === 200 ||
        response.status === 0 ||
        response.type === "opaqueredirect"
      ) {
        await onLogin();
        return;
      }

      setError("Invalid username or password.");
    } catch {
      setError(
        "Could not connect to the server. Make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>Username</label>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        autoComplete="username"
        required
      />

      <label>Password</label>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
        required
      />

      {error && <div className="error">{error}</div>}

      <button className="primary-button" disabled={loading}>
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}


/* =========================
   REGISTER
========================= */

function RegisterScreen({ onRegistered, onBack }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          name,
          password,
        }),
      });

      if (!response.ok) {
        let message = "Could not create account.";

        try {
          const data = await response.json();
          if (data.message) {
            message = data.message;
          }
        } catch {
          // Ignore invalid JSON.
        }

        setError(message);
        return;
      }

      setSuccess("Account created. You can now log in.");

      setTimeout(() => {
        onRegistered();
      }, 900);
    } catch {
      setError(
        "Could not connect to the server. Make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-mark large">I</span>
        </div>

        <h1>Create account</h1>
        <p className="subtitle">Join Interpersonal.</p>

        <form className="auth-form" onSubmit={register}>
          <label>Username</label>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />

          <label>Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            minLength="8"
            maxLength="20"
            required
          />

          <p className="password-help">
            8–20 characters, with uppercase, lowercase, and a special
            character.
          </p>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?
          <button onClick={onBack}>Log in</button>
        </div>
      </div>
    </div>
  );
}


/* =========================
   FEED
========================= */

function Feed({ user, goToCreate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFeed() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/feed/getfeed?userId=${user.id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setPosts(data);
    } catch {
      setError("Could not load your feed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
  }, [user.id]);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">HOME</p>
          <h2>Your Feed</h2>
          <p>Posts from your friends.</p>
        </div>

        <div className="heading-actions">
          <button className="secondary-button" onClick={loadFeed}>
            Refresh
          </button>

          <button className="primary-button small" onClick={goToCreate}>
            + Create Post
          </button>
        </div>
      </div>

      {loading && (
        <div className="empty-card">
          <div className="loader"></div>
          Loading your feed...
        </div>
      )}

      {error && <div className="error-card">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-card">
          <div className="empty-icon">✦</div>
          <h3>Your feed is empty</h3>
          <p>
            Add some people as friends and their posts will appear here.
          </p>

          <button
            className="primary-button small"
            onClick={goToCreate}
          >
            Create a Post
          </button>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}


/* =========================
   POST CARD
========================= */

function PostCard({ post, own = false, onDelete }) {
  const initial =
    post.authorName?.charAt(0)?.toUpperCase() || "?";

  return (
    <article className="post-card">
      <div className="post-author">
        <div className="avatar">{initial}</div>

        <div>
          <strong>{post.authorName}</strong>
          <span>@{post.authorUsername}</span>
        </div>
      </div>

      <div className="post-body">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>

      {own && onDelete && (
        <button
          className="danger-button"
          onClick={() => onDelete(post.id)}
        >
          Delete
        </button>
      )}
    </article>
  );
}


/* =========================
   CREATE POST
========================= */

function CreatePost({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createPost(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const params = new URLSearchParams({
      title,
      content,
    });

    try {
      const response = await fetch(
        `${API}/post/create?${params.toString()}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setMessage("Post published.");
      setTitle("");
      setContent("");

      setTimeout(() => {
        onCreated();
      }, 700);
    } catch {
      setError("Could not create the post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SHARE</p>
          <h2>Create a Post</h2>
          <p>Share something with your friends.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={createPost}>
        <label>Title</label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your post a title..."
          required
        />

        <label>Content</label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="8"
          required
        />

        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        <button className="primary-button" disabled={loading}>
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </section>
  );
}


/* =========================
   PROFILE
========================= */

function Profile({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/post/byAuthor?authorId=${user.id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setPosts(await response.json());
    } catch {
      setError("Could not load your posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [user.id]);

  async function deletePost(id) {
    if (!window.confirm("Delete this post?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/post/delete?id=${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setPosts((current) =>
        current.filter((post) => post.id !== id)
      );
    } catch {
      alert("Could not delete the post.");
    }
  }

  return (
    <section>
      <div className="profile-hero">
        <div className="profile-avatar">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="profile-details">
          <p className="eyebrow">PROFILE</p>
          <h2>{user.name}</h2>
          <p>@{user.username}</p>
        </div>

        <div className="profile-id">
          <span>User ID</span>
          <strong>#{user.id}</strong>
        </div>
      </div>

      <div className="section-title">
        <div>
          <h3>Your Posts</h3>
          <p>Everything you've shared on Interpersonal.</p>
        </div>

        <button
          className="secondary-button"
          onClick={loadPosts}
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="empty-card">
          Loading your posts...
        </div>
      )}

      {error && <div className="error-card">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-card">
          <div className="empty-icon">✦</div>
          <h3>No posts yet</h3>
          <p>Your posts will appear here after you publish them.</p>
        </div>
      )}

      <div className="post-list">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            own
            onDelete={deletePost}
          />
        ))}
      </div>
    </section>
  );
}


/* =========================
   PEOPLE
========================= */

function People({ user }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      const response = await fetch(`${API}/users/allusers`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setUsers(data.filter((person) => person.id !== user.id));
    } catch {
      setMessage("Could not load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [user.id]);

  async function addFriend(username) {
    setMessage("");

    try {
      const params = new URLSearchParams({
        username: user.username,
        friendUsername: username,
      });

      const response = await fetch(
        `${API}/users/addfriend?${params.toString()}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const updatedFriends = await response.json();

      setFriends(updatedFriends);
      setMessage(`@${username} is now your friend.`);
    } catch {
      setMessage("Could not add that person.");
    }
  }

  async function removeFriend(username) {
    setMessage("");

    try {
      const params = new URLSearchParams({
        username: user.username,
        friendUsername: username,
      });

      const response = await fetch(
        `${API}/users/removefriend?${params.toString()}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const updatedFriends = await response.json();

      setFriends(updatedFriends);
      setMessage(`@${username} removed from your friends.`);
    } catch {
      setMessage("Could not remove that person.");
    }
  }

  const filteredUsers = users.filter((person) => {
    const query = search.toLowerCase();

    return (
      person.username.toLowerCase().includes(query) ||
      person.name.toLowerCase().includes(query)
    );
  });

  const friendIds = new Set(friends.map((friend) => friend.id));

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">COMMUNITY</p>
          <h2>People</h2>
          <p>Find people and connect with them.</p>
        </div>
      </div>

      <div className="search-box">
        <span>⌕</span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or username..."
        />
      </div>

      {message && <div className="success">{message}</div>}

      {loading && (
        <div className="empty-card">
          Loading people...
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="empty-card">
          <h3>No people found</h3>
          <p>Try a different name or username.</p>
        </div>
      )}

      <div className="user-list">
        {filteredUsers.map((person) => {
          const isFriend = friendIds.has(person.id);

          return (
            <div className="user-card" key={person.id}>
              <div className="avatar">
                {person.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="user-info">
                <strong>{person.name}</strong>
                <span>@{person.username}</span>
              </div>

              {isFriend ? (
                <button
                  className="remove-button"
                  onClick={() =>
                    removeFriend(person.username)
                  }
                >
                  Remove
                </button>
              ) : (
                <button
                  className="secondary-button"
                  onClick={() =>
                    addFriend(person.username)
                  }
                >
                  Add Friend
                </button>
              )}
            </div>
          );
        })}
      </div>

      {friends.length > 0 && (
        <div className="friends-section">
          <div className="section-title">
            <div>
              <h3>Your Friends</h3>
              <p>{friends.length} connection(s)</p>
            </div>
          </div>

          <div className="user-list">
            {friends.map((friend) => (
              <div className="user-card" key={friend.id}>
                <div className="avatar">
                  {friend.name?.charAt(0)?.toUpperCase()}
                </div>

                <div className="user-info">
                  <strong>{friend.name}</strong>
                  <span>@{friend.username}</span>
                </div>

                <button
                  className="remove-button"
                  onClick={() =>
                    removeFriend(friend.username)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}


/* =========================
   LOGOUT
========================= */

async function logout(setUser) {
  try {
    await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    setUser(null);
  }
}

export default App;