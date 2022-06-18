import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  AuthError,
  User
} from "firebase/auth";
import {
  ref,
  get,
  set,
  push,
  update,
  serverTimestamp,
} from "firebase/database";

import { firebaseAuth, firebaseDB } from "@/services/firebase";
import { ChromeMessage, ChromeEvents, FirebaseWritePayload } from "@/types";
import { setBackgroundState } from "@/utils";

const saveOrUpdateDataOfFieldToUser = async (
  userId: string | undefined,
  field: string,
  data: any
) => {
  try {
    if (!userId) {
      return;
    }

    const dataRef = ref(firebaseDB, `users/${userId}/${field}`);
    const current = await get(dataRef);
    const hasBeenCreated = !!current.val();

    update(
      dataRef,
      hasBeenCreated
        ? {
            ...JSON.parse(JSON.stringify(data)),
            updatedAt: serverTimestamp(),
          }
        : {
            ...JSON.parse(JSON.stringify(data)),
            createdAt: serverTimestamp(),
          }
    );
  } catch (err) {
    console.log(err);
  }
};

const extractUserAccountId = async () => {
  const cookie = await chrome.cookies.get({
    url: "https://web.algebranation.com",
    name: "ci_session",
  });
  const decoded = decodeURIComponent(cookie?.value!);
  const useraccountIdIdx = decoded.indexOf("useraccount_id");
  const idMatch = decoded.slice(useraccountIdIdx).match(/"[0-9]+"/);
  let useraccountId: string = "";
  let fallbackUseraccountId: string = "";

  if (idMatch && idMatch[0]) {
    useraccountId = idMatch[0].replace(/"/g, "");
    console.log("useraccount_id", useraccountId);
  }

  // fallback to vague useraccount_id
  fallbackUseraccountId = decoded.slice(
    useraccountIdIdx,
    useraccountIdIdx + "useraccount_id".length + 20
  );

  return { useraccountId, fallbackUseraccountId };
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    appState: {
      enableChatbot: true,
    },
  });
});

chrome.runtime.onConnect.addListener(async () => {
  firebaseAuth.onAuthStateChanged(async (user) => {
    // signOut(firebaseAuth)
    const { useraccountId, fallbackUseraccountId } =
      await extractUserAccountId();

    if (user) {
      saveOrUpdateDataOfFieldToUser(user.uid, "profile", {
        ...user.toJSON(),
      });
      
      if (useraccountId.trim()) {
        saveOrUpdateDataOfFieldToUser(user.uid, "profile", {
          algebraNationData: {
            useraccountId,
            fallbackUseraccountId,
          },
        });
      }
    }

    await setBackgroundState({
      user: (user?.toJSON?.() as User) ?? null,
      algebraNationData: {
        useraccountId,
        fallbackUseraccountId,
      },
    });
  });
});

chrome.runtime.onMessage.addListener(async (message: ChromeMessage) => {
  // login
  if (message.type === ChromeEvents.login) {
    // https://prog.world/firebase-auth-in-chrome-extension-manifest-v3/
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      try {
        let credential = GoogleAuthProvider.credential(null, token);
        await signInWithCredential(firebaseAuth, credential);
      } catch (err) {
        // https://stackoverflow.com/a/14245504
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id!, {
            type: ChromeEvents.loginError,
            payload: {
              message: `Failed to login - ${(err as AuthError).message}`,
            },
          });
        });
      }
    });
  }

  // write data to DB
  if (message.type === ChromeEvents.writeDataToDB) {
    const { field, data } = message.payload as FirebaseWritePayload;
    const userId = firebaseAuth.currentUser?.uid;
    saveOrUpdateDataOfFieldToUser(userId, field, data);
  }
});

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (changeInfo.url?.includes('video/')) {
      const match = changeInfo.url.match(/[0-9]+/)
      if (!match) {
        return
      }
      chrome.tabs.sendMessage(tabId, {
        type: ChromeEvents.loadWithVideo,
        payload: {
          videoId: match[0]
        }
      })
    }
  }
);
