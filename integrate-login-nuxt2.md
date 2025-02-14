---
title: Building a login page using Kuroco and Nuxt.js
description: This tutorial explains how to build a login page in your Nuxt.js project using Kuroco. As an example, we will implement a process that makes the content list screen viewable only by logged-in users as follows.
---

This tutorial explains how to build a login page in your Nuxt.js project using Kuroco. As an example, we will implement a process that makes the content list screen viewable only by logged-in users as follows:

- Create an API and the corresponding endpoints
- Implement the login form
- Implement the login process (for each API security option)

## Before you start

### Nuxt.js project

This tutorial assumes that you have already created a Nuxt.js project using Kuroco. If you have not done so, see [Tutorial: Creating a content list page with Kuroco and Nuxt.js](/docs/tutorials/integrate-kuroco-with-nuxt/).

### API security

Kuroco offers 4 options for API security.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/0679cd55727be144fdcc805cbc7178cc.png)
The "None" option allows users to fetch data from the API without login, but all the other options require users to log in.

This tutorial walks you through how to build a login form on the front-end with the following security options:

- Cookies
- Dynamic access token

:::info
See: [Management screen - API security](/docs/management/api-security/) for details on each of the security options.
:::

:::info
See: [Tutorial - How to check the API security using Swagger UI](/docs/tutorials/how-to-use-swagger-ui/) for details on the security settings.
:::

### Recommended browser

We recommend using Google Chrome for this tutorial, as you will be using Chrome developer tools for operation checks.

## Creating your API and endpoints

### Create an API

First, navigate to Kuroco's API management screen and click [Create new API].

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/97dc32d7506f37f6094e8f9e49439d3e.png)
In the API editor dialog, enter the following setting values and click [Add].

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/8ae7dbe362fb6b57970b1b923b190d01.png)

| Item        | Setting       |
| :---------- | :------------ |
| Title       | login         |
| Version     | 1.0           |
| Description | API for login |

Refresh the screen to see the new API.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/51fca91afb42cd06db72af01152b8cd4.png)
### Create the endpoints

Next, create the following endpoints:

- `login`
- `profile`
- `logout`
- `token` (only for the "Dynamic access token" API security option)

Click the [Configure endpoint] button to create new endpoints.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/4ff254c67944daa6fcf95fa489276f0f.png)
#### A. Login endpoint

Use the settings below for the login endpoint.

![Image from Gyazo](https://t.gyazo.com/teams/diverta/842da1b097914d134b0c002839ef2c24.png)

| Item      | Setting         |
| :-------- | :-------------- |
| Path      | `login`         |
| Category  | Authentication  |
| Model     | login v1        |
| Operation | login_challenge |

Click [Add] to save the endpoint.

#### B. Profile endpoint

Use the settings below for the profile endpoint.

![Image from Gyazo](https://t.gyazo.com/teams/diverta/b6ecfea23e0d9ba8009a353613284651.png)

| Item                   | Setting                                                                                        |
| :--------------------- | :--------------------------------------------------------------------------------------------- |
| Path                   | `profile`                                                                                      |
| Category               | Authentication                                                                                 |
| Model                  | login v1                                                                                       |
| Operation              | profile                                                                                        |
| API request restriction         | GroupAuth: groups<ul><li>Select the user groups that are allowed to login.</li></ul> |
| Basic settings: basic_info | <ul><li>email</li><li>name1</li><li>name2</li></ul>|

Click [Add] to save the endpoint.

The profile endpoint can easily retrieve accessing information on the user. Since we configured the authentication with GroupAuth, if a user is not logged in, the endpoint will return an error.

In the above example, we configured the endpoint to retrieve the values `email`, `name1`, and `name2`. In addition to returning basic user information, the endpoint also verifies if the active user is actually logged in when it is restoring the user's login status.

#### C. Logout endpoint

Use the settings below for the logout endpoint.

![Image from Gyazo](https://t.gyazo.com/teams/diverta/23c569160f1a3f8e2ddd1773deac7625.png)

| Item           | Setting        |
| :------------- | :------------- |
| Path           | `logout`       |
| Category       | Authentication |
| Model          | login v1       |
| Operation      | logout         |
| API request restriction | None           |

Click [Add] to save the endpoint.

#### D. Token endpoint

Use the settings below for the token endpoint.

:::tip
This endpoint is only required when you are using dynamic access tokens. You do not need to create a token endpoint if you are using cookies.
:::

![Image from Gyazo](https://t.gyazo.com/teams/diverta/bdfc8a783ece74e9f1957a8830ce5705.png)

| Item           | Setting        |
| :------------- | :------------- |
| Path           | `token`        |
| Category       | Authentication |
| Model          | login v1       |
| Operation      | token          |
| API request restriction | None           |

Click [Add] to save the endpoint.

## Implementing the login form

After setting up all the necessary endpoints, implement a login form on the front-end according to the steps below.

### Implement a dummy login form

First, we will create a login screen component without integrating with the API and implement a dummy login process. We will also restrict access to the notification list based on user login flags, and users who are not logged in will be redirected to the login screen.

To create the login screen component, make a new `pages/login/index.vue` file and paste the following code into it:

```html
<template>
  <form @submit.prevent="login">
    <input v-model="email" name="email" type="email" placeholder="email" />
    <input
      v-model="password"
      name="password"
      type="password"
      placeholder="password"
    />
    <button type="submit">
      Login
    </button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      login() {
        console.log(this.email, this.password);
      },
    },
  };
</script>
```

<!-- textlint-disable -->

Run `npm run dev` in the command line and go to `http://localhost:3000/login` in your browser. You will see the simple login screen shown below.

<!-- textlint-enable -->

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/39993c3fa66e7e0ad753c661106e4c8c.png)
With the Chrome Developer Tools console open, fill out the form and click [Login].

- Email: `test@example.com`
- Password: `password`

Verify the console log. It should display the email and password you entered.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/40d82b5b8c67cd91493719edd115df7a.png)
Then, send a request to the login API with the above values. For now, we will implement a temporary API integration just to verify the post-login operations. To do this, create a dummy process that sends a 1-second request, and modify it so that "Login successful" appears on the screen when the login request is successful:

```diff
diff --git pages/login/index.vue pages/login/index.vue
index b3a8c36..eb123b4 100644
--- pages/login/index.vue
+++ pages/login/index.vue
@@ -1,30 +1,65 @@
 <template>
     <form @submit.prevent="login">
+        <p v-if="loginStatus !== null" :style="{ color: resultMessageColor }">
+            {{ resultMessage }}
+        </p>
+
         <input v-model="email" name="email" type="email" placeholder="email">
         <input
             v-model="password"
             name="password"
             type="password"
             placeholder="password"
         >
         <button type="submit">
             Login
         </button>
     </form>
 </template>

 <script>
 export default {
     data () {
         return {
             email: '',
-            password: ''
+            password: '',
+
+            loginStatus: null,
+            resultMessage: null
+        }
+    },
+    computed: {
+        resultMessageColor () {
+            switch (this.loginStatus) {
+            case 'success':
+                return 'green'
+            case 'failure':
+                return 'red'
+            default:
+                return ''
+            }
         }
     },
     methods: {
-        login () {
-            console.log(this.email, this.password)
+        async login () {
+            // Dummy request(Succeed/fail after 1 sec.)
+            const shouldSuccess = true
+            const request = new Promise((resolve, reject) =>
+                setTimeout(
+                    () => (shouldSuccess ? resolve() : reject(Error('login failure'))),
+                    1000
+                )
+            )
+
+            try {
+                await request
+                this.loginStatus = 'success'
+                this.resultMessage = 'Login successful'
+            } catch (e) {
+                this.loginStatus = 'failure'
+                this.resultMessage = 'Login failed'
+            }
         }
     }
 }
 </script>
```

You should see the message "Login successful" after a 1-second delay.
  
![fetched from Gyazo](https://t.gyazo.com/teams/diverta/08b8cdec8e99124a7d87422e4e7843b0.gif)
Now, verify the operation when the login fails. In the source code, change `shouldSuccess = true` to `shouldSuccess = false`. This should return an error when you click [Login].
  
![fetched from Gyazo](https://t.gyazo.com/teams/diverta/1786addd1e45c746852b05af318fd8be.gif)
Afterwards, make sure to change the source code to `shouldSuccess = true` again.

### Store user login status

#### A. Create a store

First, create a **store** to maintain the user's login status across the entire web app first that can be referenced by other screens.

Make a new `store/index.js` file and paste the code below into it:

```javascript
export const state = () => ({
  profile: null,
});

export const getters = {
  authenticated(state) {
    return state.profile !== null;
  },
};

export const mutations = {
  setProfile(state, { profile }) {
    state.profile = profile;
  },
};
```

The `authenticated` state under `getters` returns a value of `true` or `false`, depending on whether the profile data (which you will generate later) is empty.
  
If it is non-empty, the status will recognized as logged in. The profile data will be automatically retrieved when logging in later or when restoring the login state. A value will not be set in other cases, such as when the user logs out.

#### B. Create middleware

Next, create a new `middleware/auth.js` file containing the following code:

```javascript
export default async ({ app, store, redirect }) => {
  if (!store.getters.authenticated) {
    return redirect('/login');
  }
  await null;
};
```

"Middleware" refers to the operation before the source `page/*.vue` process for each screen. A value of `false` for the `authenticated` parameter of the store redirects the user to the login screen.

#### C. Verify the middleware operation

Insert the following code into `pages/login/index.vue` to add a link to the news list page:

```diff
diff --git a/pages/login/index.vue b/pages/login/index.vue
index eb123b4..37d845a 100644
--- a/pages/login/index.vue
+++ b/pages/login/index.vue
@@ -14,6 +14,12 @@
         <button type="submit">
             Login
         </button>
+
+        <div>
+            <nuxt-link to="/news">
+                news list
+            </nuxt-link>
+        </div>
     </form>
 </template>

```

Also, modify the source code in `pages/news/index.vue` to apply the middleware.

```diff
diff --git a/pages/news/index.vue b/pages/news/index.vue
index ac8e0fd..dcdd806 100644
--- a/pages/news/index.vue
+++ b/pages/news/index.vue
@@ -10,6 +10,7 @@

 <script>
 export default {
+    middleware: 'auth',
     async asyncData ({ $axios }) {
         try {
             const response = await $axios.$get(process.env.BASE_URL + '/rcms-api/1/news')

```

With this process in place, users will have to log in to access the news list page. Non-logged-in visitors will be redirected to the login screen.

Next, modify `pages/login/index.vue` so that the `profile` object under `store` is not null:

```diff
diff --git a/pages/login/index.vue b/pages/login/index.vue
index 37d845a..b3cd6a1 100644
--- a/pages/login/index.vue
+++ b/pages/login/index.vue
@@ -59,6 +59,8 @@ export default {

             try {
                 await request
+                this.$store.commit('setProfile', { profile: {} }) // Apply the dummy object to store.state.profile
+
                 this.loginStatus = 'success'
                 this.resultMessage = 'Login successful'
             } catch (e) {

```

Verify that you can access the news list page after logging in.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/56dec7340110021efd1a8a6580d8e340.gif)
:::tip
Use [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd/reviews?hl=en&authuser=2) to verify the above operation.
:::

### Implement a restore function for login status

The above steps implement the normal login process. However, one problem remains: When users refresh the screen or access the URL directly, they are redirected to the login page even if they have already logged in. In the above operation, the `profile` object under `store` becomes null when Nuxt is initialized. Therefore, logged-in users appear to be logged out to Nuxt.

We will implement the following two-part solution for this problem:

- Once the user logs in, we set a flag in LocalStorage.
- A flag value of `true` applies dummy data to the `profile` object in `store`.

First, modify the code in `/store/index.js` as shown below:

```diff
diff --git a/store/index.js b/store/index.js
index 1c36f1d..5cca182 100644
--- a/store/index.js
+++ b/store/index.js
@@ -13,3 +13,15 @@ export const mutations = {
         state.profile = profile
     }
 }
+
+export const actions = {
+    async restoreLoginState ({ commit }) {
+        const authenticated = JSON.parse(localStorage.getItem('authenticated'))
+
+        if (!authenticated) {
+            throw new Error('need to login')
+        }
+        commit('setProfile', { profile: {} }) // Store the dummy object.
+        await null
+    }
+}

```

Also, modify `/middleware/auth.js` as follows:

```diff
diff --git a/middleware/auth.js b/middleware/auth.js
index d3c7ffe..4aa086c 100644
--- a/middleware/auth.js
+++ b/middleware/auth.js
@@ -1,7 +1,9 @@
 export default async ({ app, store, redirect }) => {
     if (!store.getters.authenticated) {
-        return redirect('/login')
+        try {
+            await store.dispatch('restoreLoginState')
+        } catch (err) {
+            return redirect('/login')
+        }
     }
-
-    await null
 }

```

Verify 4 behaviors on the news list page:

- When the `authenticated` value in LocalStorage is `false`, you are redirected to the login screen.
- When the `authenticated` value in LocalStorage is `true`, you are NOT redirected to the login screen.
- When the `authenticated` value in LocalStorage is `true` and you refresh the page, you are NOT redirected to the login screen.
- When the `authenticated` value in LocalStorage is `false` and you refresh the page, you are redirected to the login screen.

To do so, open the [Application] tab in the Chrome developer tools. The `authenticated` key appears when you log in on the login screen.

![Image (fetched from Gyazo)](https://t.gyazo.com/teams/diverta/62e95b5bd8a3bfdb094c98adeeb270e4.png)
Change the value to `true` or `false` and test the above behaviors.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/314b063e93383a7eb636abdef9d722ae.gif)
### Configure the login operation

Next, configure the login operation so that `authenticated` in LocalStorage takes a value of `true` when the login is successful. Also, move some parts of the login process to `store` for future revisions. Modify `/pages/login/index.vue` as follows:

```diff
diff --git a/pages/login/index.vue b/pages/login/index.vue
index b3cd6a1..25f6a8c 100644
--- a/pages/login/index.vue
+++ b/pages/login/index.vue
@@ -48,18 +48,12 @@ export default {
     },
     methods: {
         async login () {
-            // Dummy request(Succeed/fail after 1 sec.)
-            const shouldSuccess = true
-            const request = new Promise((resolve, reject) =>
-                setTimeout(
-                    () => (shouldSuccess ? resolve() : reject(Error('login failure'))),
-                    1000
-                )
-            )
-
             try {
-                await request
-                this.$store.commit('setProfile', { profile: {} }) // Apply the dummy object to store.state.profile
+                const payload = {
+                    email: this.email,
+                    password: this.password
+                }
+                await this.$store.dispatch('login', payload)

                 this.loginStatus = 'success'
                 this.resultMessage = 'Login Successful'

```

And modify `/store/index.js` as shown below:

```diff
diff --git a/store/index.js b/store/index.js
index 5cca182..b09c428 100644
--- a/store/index.js
+++ b/store/index.js
@@ -11,10 +11,29 @@ export const getters = {
 export const mutations = {
     setProfile (state, { profile }) {
         state.profile = profile
+    },
+    updateLocalStorage (state, payload) {
+        Object.entries(payload).forEach(([key, val]) => {
+            localStorage.setItem(key, val)
+        })
     }
 }

 export const actions = {
+    async login ({ commit }, payload) {
+        // dummy request(succeed/fail after 1 sec.)
+        const shouldSuccess = true
+        const request = new Promise((resolve, reject) =>
+            setTimeout(
+                () => (shouldSuccess ? resolve() : reject(Error('login failure'))),
+                1000
+            )
+        )
+        await request
+
+        commit('setProfile', { profile: {} }) // Apply the dummy object to store.state.profile
+        commit('updateLocalStorage', { authenticated: true })
+    },
     async restoreLoginState ({ commit }) {
         const authenticated = JSON.parse(localStorage.getItem('authenticated'))

```

Verify that an `authenticated` key value of `true` is returned upon successful login.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/3c9b258dc445720d0b8598e6d40cd149.gif)
After the front-end implementation, the next step is to implement the API. The method to do this differs depending on the API security option selected.  
This tutorial explains the implementation process for cookie and dynamic access token authentication. Refer to the correct process below for your API security settings:

- A. [Cookies](#a-login-process-implementation-cookies)
- B. [Dynamic access token](#b-login-process-implementation-dynamic-access-token)

## A. Login process implementation (Cookies)

The next step is to modify the above dummy login process to access the login endpoint.

In the Kuroco admin panel sidebar, click [API] -> [login]. Then click [Security] on the endpoint list screen.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/dc0577b34cb38cfefa984013bec27e5e.png)
In the `Security` dropdown list, select [Cookie] and click [Save].

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/4215bebb239ed6a48e69430888b81851.png)
### Implement requests to the login endpoint

Modify `store/index.js` as shown below:

```diff
diff --git a/store/index.js b/store/index.js
index b09c428..45982c8 100644
--- a/store/index.js
+++ b/store/index.js
@@ -21,15 +21,7 @@ export const mutations = {

 export const actions = {
     async login ({ commit }, payload) {
-        // dummy request(succeed/fail after 1 sec.)
-        const shouldSuccess = true
-        const request = new Promise((resolve, reject) =>
-            setTimeout(
-                () => (shouldSuccess ? resolve() : reject(Error('login failure'))),
-                1000
-            )
-        )
-        await request
+        await this.$axios.$post(process.env.BASE_URL + '/rcms-api/1/login', payload)

         commit('setProfile', { profile: {} }) // Apply the dummy object to store.state.profile
         commit('updateLocalStorage', { authenticated: true })

```

Next, verify if the login endpoint is receiving the request.

Log in from the login page with the Chrome developer tools [Network] tab open. You should see the request sent to the login endpoint.

![Image (fetched from Gyazo)](https://t.gyazo.com/teams/diverta/e5ba4778eecabe224ae2fa018819eb04.png)
### Enable cookies

To enable cross-origin cookies, modify `nuxt.config.js` as follows:

```diff
diff --git a/nuxt.config.js b/nuxt.config.js
index 56cd22f..0445d45 100644
--- a/nuxt.config.js
+++ b/nuxt.config.js
@@ -51,9 +51,9 @@ export default {

     // Axios module configuration: https://go.nuxtjs.dev/config-axios
-     axios: {},
+     axios: {
+         baseURL: process.env.BASE_URL,
+         credentials: true,
+         withCredentials: true
+     },

     // Build Configuration: https://go.nuxtjs.dev/config-build

```

### Implement request/handling to the profile endpoint

In the above implementation, you have been using the `authenticated` flag of the browser's local storage to determine if a user is logged in. However, LocalStorage can be easily altered in the browser. Also, depending on the expiration date of the session, a request to other endpoints may return an access error even when the value of `authenticated` is true. To prevent such errors, we will implement an additional check by accessing the API.

To do this, modify `/store/index.js` as shown below:

```diff
--- a/store/index.js
+++ b/store/index.js
@@ -24,7 +24,13 @@ export const mutations = {
 export const actions = {
   async login({ commit }, payload) {
     await this.$axios.$post(process.env.BASE_URL + '/rcms-api/2/login', payload)
-    commit('setProfile', { profile: {} }) // store a dummy object.
+    const profileRes = await this.$axios.$get(process.env.BASE_URL + '/rcms-api/1/profile')
+    commit('setProfile', { profile: profileRes })
     commit('updateLocalStorage', { authenticated: true })
   },
   async restoreLoginState({ commit }) {
@@ -33,7 +39,13 @@ export const actions = {
     if (!authenticated) {
       throw new Error('need to login')
     }
-    commit('setProfile', { profile: {} }) // store a dummy object.
-    await null
+
+    const profileRes = await this.$axios.$get(process.env.BASE_URL + '/rcms-api/1/profile')
+    commit('setProfile', { profile: profileRes })
   },
 }
```

After logging in, refresh your browser and navigate to the news list page. Verify that the login status is restored.

On the login page, log in with the Chrome developer tools [Application] tab open. You should see that `authenticated` has a value of `true`.

![Image (fetched from Gyazo)](https://t.gyazo.com/teams/diverta/022f5f48843929fdd94f23b3fe4c220b.png)
Then, verify that the value remains `true` even if you click the link back to the news list page.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/78a69c39bb4de3780b8f38cbb3a73f2a.gif)
### Implement request/handling to the logout endpoint

The next step is to implement the logout process.

Sometimes, you may encounter unexpected behaviors, such as when you log in again on the front-end side during an ongoing session on Kuroco's back-end. Therefore, to determine if a user is logged in, you need to send a logout request to the API.

To do this, modify `/store/index.js` as shown below:

```diff
diff --git a/store/index.js b/store/index.js
index 296c4dc..068e184 100644
--- a/store/index.js
+++ b/store/index.js
@@ -27,13 +27,29 @@ export const actions = {
         commit('setProfile', { profile: profileRes })
         commit('updateLocalStorage', { authenticated: true })
     },
-    async restoreLoginState ({ commit }) {
+    async logout ({ commit }) {
+        try {
+            await this.$axios.$post(process.env.BASE_URL + '/rcms-api/1/logout')
+        } catch {
+            /** No Process */
+            /** When it returns errors, it consider that logout is complete and ignore this process. */
+        }
+        commit('setProfile', { profile: null })
+        commit('updateLocalStorage', { authenticated: false })
+
+        this.$router.push('/login')
+    },
+    async restoreLoginState ({ commit, dispatch }) {
         const authenticated = JSON.parse(localStorage.getItem('authenticated'))

         if (!authenticated) {
+            await dispatch('logout')
+            throw new Error('need to login')
+        }
+        try {
+            const profileRes = await this.$axios.$get(process.env.BASE_URL + '/rcms-api/1/profile')
+            commit('setProfile', { profile: profileRes })
+        } catch {
+            await dispatch('logout')
             throw new Error('need to login')
         }
-        const profileRes = await this.$axios.$get(process.env.BASE_URL + '/rcms-api/1/profile')
-        commit('setProfile', { profile: profileRes })
     }
 }

```

And add a logout button to the news list page as follows:

```diff
diff --git pages/news/index.vue pages/news/index.vue
index dcdd806..e79e075 100644
--- pages/news/index.vue
+++ pages/news/index.vue
@@ -1,23 +1,31 @@
 <template>
     <div>
+        <button type="button" @click="logout">
+            Logout
+        </button>
         <div v-for="n in response.list" :key="n.slug">
             <nuxt-link :to="'/news/'+ n.slug">
                 {{ n.ymd }} {{ n.subject }}
             </nuxt-link>
         </div>
     </div>
 </template>

 <script>
+import { mapActions } from 'vuex'
+
 export default {
     middleware: 'auth',
     async asyncData ({ $axios }) {
         try {
             const response = await $axios.$get(process.env.BASE_URL + '/rcms-api/1/news')
             return { response }
         } catch (e) {
             console.log(e.message)
         }
+    },
+    methods: {
+        ...mapActions(['logout'])
     }
 }
 </script>

```

After logging in, go to the news list page and click the logout button. Verify the following behaviors:

- The logout endpoint receives a request.
- You are redirected to the login page.
- If you access the news list page without logging in, you are also redirected to the login page.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/8627f900c0652b11a1c84c3f33199842.gif)
This concludes the login process implementation for cookie-based API authentication.

## B. Login process implementation (Dynamic access token)

The next step is to modify the above dummy login process to access the login endpoint.

In Kuroco's admin panel sidebar, click [API] -> [login]. Then click [Security] on the endpoint list screen.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/dc0577b34cb38cfefa984013bec27e5e.png)
In the `Security` dropdown list, select [Dynamic access token] and click [Save].

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/369a79e07f48dad1df68a558f4f5d365.png)
### Implement requests to the login and token endpoints

Modify `store/index.js` as shown below:

```diff
diff --git a/store/index.js b/store/index.js
index b09c428..64e6e2d 100644
--- a/store/index.js
+++ b/store/index.js
@@ -21,15 +21,11 @@ export const mutations = {

 export const actions = {
     async login ({ commit }, payload) {
-        // dummy request(succeed/fail after 1 sec.)
-        const shouldSuccess = true
-        const request = new Promise((resolve, reject) =>
-            setTimeout(
-                () => (shouldSuccess ? resolve() : reject(Error('login failure'))),
-                1000
-            )
+        const { grant_token } = await this.$axios.$post(process.env.BASE_URL + '/rcms-api/1/login', payload)
+        const { access_token } = await this.$axios.$post(
+            process.env.BASE_URL + '/rcms-api/1/token',
+            { grant_token }
         )
-        await request

         commit('setProfile', { profile: {} }) // Apply the dummy object to store.state.profile
         commit('updateLocalStorage', { authenticated: true })

```

Next, verify if the login and token endpoints is receiving the requests.

Log in from the login page with the Chrome developer tools [Network] tab open. You should see the requests sent to both endpoints.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/79bc58bf120ff305145d5a9dfc71d706.gif)
### Store the token values

Dynamic access tokens require actual token values for the endpoint to be authenticated. Therefore, you need to change `authenticated` to `token` to store the token values:

```diff
diff --git store/index.js store/index.js
index 64e6e2d..9b048c5 100644
--- store/index.js
+++ store/index.js
@@ -1,42 +1,50 @@
 export const state = () => ({
     profile: null
 })

 export const getters = {
     authenticated (state) {
         return state.profile !== null
     }
 }

 export const mutations = {
     setProfile (state, { profile }) {
         state.profile = profile
     },
     updateLocalStorage (state, payload) {
         Object.entries(payload).forEach(([key, val]) => {
             localStorage.setItem(key, val)
         })
+    },
+    setAccessTokenOnRequestHeader (state, { rcmsApiAccessToken }) {
+        this.$axios.defaults.headers.common = {
+            'X-RCMS-API-ACCESS-TOKEN': rcmsApiAccessToken
+        }
     }
 }

 export const actions = {
     async login ({ commit }, payload) {
         const { grant_token } = await this.$axios.$post(process.env.BASE_URL + '/rcms-api/1/login', payload)
         const { access_token } = await this.$axios.$post(
             process.env.BASE_URL + '/rcms-api/1/token',
             { grant_token }
         )

+        commit('updateLocalStorage', { rcmsApiAccessToken: access_token.value })
+        commit('setAccessTokenOnRequestHeader', { rcmsApiAccessToken: access_token.value })
+
         commit('setProfile', { profile: {} }) // Apply the dummy object to store.state.profile
-        commit('updateLocalStorage', { authenticated: true })
     },
     async restoreLoginState ({ commit }) {
-        const authenticated = JSON.parse(localStorage.getItem('authenticated'))
+        const rcmsApiAccessToken = localStorage.getItem('rcmsApiAccessToken')
+        const authenticated = typeof rcmsApiAccessToken === 'string' && rcmsApiAccessToken.length > 0

         if (!authenticated) {
             throw new Error('need to login')
         }
         commit('setProfile', { profile: {} }) // store dummy object.
         await null
     }
 }

```

Verify the operation by logging in on the login page with the Chrome developer tools [Network] tab open. You should see the token value stored in `rcmsApiAccessToken`.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/7683dcc908622c9f2fbe03f7c53995c9.gif)
### Implement request/handling to the profile endpoint

In the above implementation, you have been using the `authenticated` flag of the browser's local storage to determine if a user is logged in. However, LocalStorage can be easily altered in the browser. Also, depending on the expiration date of the session, a request to other endpoints may return an access error even when the value of `authenticated` is true. To prevent such errors, we will implement an additional check by accessing the API.

To do this, modify `/store/index.js` as shown below:

```diff
diff --git store/index.js store/index.js
index 9b048c5..c64b3a9 100644
--- store/index.js
+++ store/index.js
@@ -1,50 +1,57 @@
 export const state = () => ({
     profile: null
 })

 export const getters = {
     authenticated (state) {
         return state.profile !== null
     }
 }

 export const mutations = {
     setProfile (state, { profile }) {
         state.profile = profile
     },
     updateLocalStorage (state, payload) {
         Object.entries(payload).forEach(([key, val]) => {
             localStorage.setItem(key, val)
         })
     },
     setAccessTokenOnRequestHeader (state, { rcmsApiAccessToken }) {
         this.$axios.defaults.headers.common = {
             'X-RCMS-API-ACCESS-TOKEN': rcmsApiAccessToken
         }
     }
 }

 export const actions = {
     async login ({ commit }, payload) {
         const { grant_token } = await this.$axios.$post(process.env.BASE_URL + '/rcms-api/1/login', payload)
         const { access_token } = await this.$axios.$post(
             process.env.BASE_URL + '/rcms-api/1/token',
             { grant_token }
         )

         commit('updateLocalStorage', { rcmsApiAccessToken: access_token.value })
         commit('setAccessTokenOnRequestHeader', { rcmsApiAccessToken: access_token.value })

-        commit('setProfile', { profile: {} }) // Apply the dummy object to store.state.profile
+        const profileRes = await this.$axios.$get(process.env.BASE_URL + '/rcms-api/1/profile')
+        commit('setProfile', { profile: profileRes })
     },
     async restoreLoginState ({ commit }) {
         const rcmsApiAccessToken = localStorage.getItem('rcmsApiAccessToken')
         const authenticated = typeof rcmsApiAccessToken === 'string' && rcmsApiAccessToken.length > 0

         if (!authenticated) {
             throw new Error('need to login')
         }
-        commit('setProfile', { profile: {} }) // store a dummy object.
-        await null
+
+        try {
+            commit('setAccessTokenOnRequestHeader', { rcmsApiAccessToken })
+            const profileRes = await this.$axios.$get(process.env.BASE_URL + '/rcms-api/1/profile')
+            commit('setProfile', { profile: profileRes })
+        } catch {
+            throw new Error('need to login')
+        }
     }
 }

```

After logging in, refresh your browser and navigate to the news list page. Verify that the login status is restored.

On the login page, log in with the Chrome developer tools [Application] tab open. You should see the token value stored in `rcmsApiAccessToken`.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/49669f73da2cd59af13c17bf9a37ceb8.gif)
Also, modify `rcmsApiAccessToken` in LocalStorage using the Chrome developer tools and verify that you are redirected to the login screen at the time of restoration.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/5edfbdf317001395e794f30c6ca8380e.gif)
### Implement request/handling to the logout endpoint

The next step is to implement the logout process.

Sometimes, you may encounter unexpected behaviors, such as when you log in again on the front-end side during an ongoing session on Kuroco's back-end. Therefore, to determine if a user is logged in, you need to send a logout request to the API.

To do this, modify `/store/index.js` as shown below:

```diff
diff --git a/store/index.js b/store/index.js
index c64b3a9..0e97247 100644
--- a/store/index.js
+++ b/store/index.js
@@ -38,19 +38,32 @@ export const actions = {
         const profileRes = await this.$axios.$get(process.env.BASE_URL + '/rcms-api/1/profile')
         commit('setProfile', { profile: profileRes })
     },
-    async restoreLoginState ({ commit }) {
+    async logout ({ commit }) {
+        try {
+            await this.$axios.$post(process.env.BASE_URL + '/rcms-api/1/logout')
+        } catch {
+            /** No Process */
+            /** When it returns errors, it consider that logout is complete and ignore this process. */
+        }
+        commit('setProfile', { profile: null })
+        commit('updateLocalStorage', { rcmsApiAccessToken: null })
+        commit('setAccessTokenOnRequestHeader', { rcmsApiAccessToken: null })
+
+        this.$router.push('/login')
+    },
+    async restoreLoginState ({ commit, dispatch }) {
         const rcmsApiAccessToken = localStorage.getItem('rcmsApiAccessToken')
         const authenticated = typeof rcmsApiAccessToken === 'string' && rcmsApiAccessToken.length > 0

         if (!authenticated) {
+            await dispatch('logout')
             throw new Error('need to login')
         }
-
         try {
             commit('setAccessTokenOnRequestHeader', { rcmsApiAccessToken })
             const profileRes = await this.$axios.$get(process.env.BASE_URL + '/rcms-api/1/profile')
             commit('setProfile', { profile: profileRes })
         } catch {
+            await dispatch('logout')
             throw new Error('need to login')
         }
     }

```

And add a logout button to the news list page as follows:

```diff
diff --git pages/news/index.vue pages/news/index.vue
index dcdd806..e79e075 100644
--- pages/news/index.vue
+++ pages/news/index.vue
@@ -1,23 +1,31 @@
 <template>
     <div>
+        <button type="button" @click="logout">
+            Logout
+        </button>
         <div v-for="n in response.list" :key="n.slug">
             <nuxt-link :to="'/news/'+ n.slug">
                 {{ n.ymd }} {{ n.subject }}
             </nuxt-link>
         </div>
     </div>
 </template>

 <script>
+import { mapActions } from 'vuex'
+
 export default {
     middleware: 'auth',
     async asyncData ({ $axios }) {
         try {
             const response = await $axios.$get(process.env.BASE_URL + '/rcms-api/1/news')
             return { response }
         } catch (e) {
             console.log(e.message)
         }
+    },
+    methods: {
+        ...mapActions(['logout'])
     }
 }
 </script>

```

After logging in, go to the news list page and click the logout button. Verify the following behaviors:

- The logout endpoint receives a request.
- You are redirected to the login page.
- If you access the news list page without logging in, you are also redirected to the login page.

![fetched from Gyazo](https://t.gyazo.com/teams/diverta/a1fc423b3d9bb866e38ec20091f21020.gif)
This concludes the login process implementation for dynamic access token-based API authentication.

## Note

The above is an introduction on creating a login page in your Nuxt.js project using Kuroco.

For clarity, we introduced the implementation of a very simple login screen. In actual use, you may need to include more complex components such as form validation and libraries such as `@nuxt/auth`. Nevertheless, we hope the above tutorial can serve as an introduction to the basic login setup.
