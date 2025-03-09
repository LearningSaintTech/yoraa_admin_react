import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBAEJSB5QJl_0MEr13gjLzBNYxdXuUliSk",
    authDomain: "ecommerce-e038c.firebaseapp.com",
    projectId: "ecommerce-e038c",
    storageBucket: "ecommerce-e038c.appspot.com",
    messagingSenderId: "841829729642",
    appId: "1:841829729642:web:ecd6b4d97b2796617cd113",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

// Setup Recaptcha properly
const setupRecaptcha = (containerId = "recaptcha-container") => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            size: "invisible",
            callback: (response) => {
                console.log("reCAPTCHA Verified!");
            },
            "expired-callback": () => {
                console.log("reCAPTCHA Expired. Please refresh.");
            }
        });
        window.recaptchaVerifier.render();
    }
};

export { auth, setupRecaptcha, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential };
