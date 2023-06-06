(function (t, e) {
  const firebaseConfig = {
    apiKey: "AIzaSyAbeR-bTb7kCGRouTHhnhT5k9OKyw6I2Mg",
    authDomain: "pgstpm.firebaseapp.com",
    databaseURL: "https://pgstpm-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pgstpm",
    storageBucket: "pgstpm.appspot.com",
    messagingSenderId: "1077948418495",
    appId: "1:1077948418495:web:64dcddd3bbe32abd6a790a",
  };

  firebase.initializeApp(firebaseConfig);

  // Initialize the FirebaseUI Widget using Firebase.
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  const buttonLogout = document.querySelector("[data-button-logout]");

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        const user = authResult.user;

        postData(location.origin + "/api/users", {
          id: user.uid,
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          createdAt: user.metadata.createdAt,
          lastLoginAt: user.metadata.lastLoginAt,
        });
        return true;
      },
      uiShown: function () {
        buttonLogout.style.display = "none";
        document.getElementById("loader").style.display = "none";
      },
    },
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    tosUrl: "/",
    privacyPolicyUrl: "/",
  };

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      buttonLogout.style.display = "block";
      document.getElementById("loader").style.display = "none";
      const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
      const device = toMatch.some((toMatchItem) => {
        if (navigator.userAgent.match(toMatchItem)) {
          console.log(navigator.userAgent.match(toMatchItem));
          return navigator.userAgent.match(toMatchItem);
        }
      });
      console.log(device);
    } else {
      console.log("User is signed out");
      document.getElementById("loader").style.display = "none";
      buttonLogout.style.display = "none";
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  });

  buttonLogout.addEventListener("click", (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signOut()
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  }

  const messaging = firebase.messaging();

  // Retrieve the FCM token
  messaging
    .getToken({ vapidKey: "BBGHmrBzY-sZlMnyImcgV5JkjB-I7cTtJv6p22OR-PAYUUmEKzNjJtaTFePUAGVGq4THh5ngKu1eSKx8gBZOBJY" })
    .then((currentToken) => {
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        // Send the token to your server for further handling
      } else {
        console.log("No registration token available.");
      }
    })
    .catch((error) => {
      console.log("An error occurred while retrieving token:", error);
    });

  messaging.onMessage((payload) => {
    console.log("Received message:", payload);
    // Customize how the notification is displayed
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon,
    };

    // Display the notification
    new Notification(notificationTitle, notificationOptions);
  });

  "object" == typeof exports && "object" == typeof module
    ? (module.exports = postData())
    : "function" == typeof define && define.amd
    ? define("pgs", [], e)
    : "object" == typeof exports
    ? (exports.pgs = e())
    : (t.pgs = e());
})(this, () => {
  return class {
    constructor(table) {
      this.table = table;
    }
    init() {
      console.log(`This is ${this.table}`);
    }
  };
});
