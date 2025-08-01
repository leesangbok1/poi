// --- FIREBASE SDK IMPORTS & INITIALIZATION ---
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    writeBatch,
    query,
    orderBy,
    limit,
    startAfter,
    endBefore,
    limitToLast,
    where,
    Timestamp,
    updateDoc,
    increment,
    deleteDoc,
} from "firebase/firestore";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

// Vite exposes env variables on the import.meta.env object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        // Check if user exists in 'users' collection, if not, add them
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                name: user.displayName,
                profilePic: user.photoURL,
                email: user.email,
                createdAt: Timestamp.now()
            });
        }
        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
}

export async function signInWithFacebook() {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        // Check if user exists in 'users' collection, if not, add them
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                name: user.displayName,
                profilePic: user.photoURL,
                email: user.email,
                createdAt: Timestamp.now()
            });
        }
        return user;
    } catch (error) {
        console.error("Error signing in with Facebook:", error);
        throw error;
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

export function onAuthChange(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            callback({ id: user.uid, name: user.displayName, profilePic: user.photoURL, email: user.email });
        } else {
            // User is signed out
            callback(null);
        }
    });
}

// --- MOCK DATA (for one-time population) ---
// This data is only used by the populateDatabase function
const mockUsers = {
    'user01': { name: 'Minh', profilePic: 'https://placehold.co/40x40/31343C/FFFFFF?text=M', isAdmin: true },
    'user02': { name: 'Hoa', profilePic: 'https://placehold.co/40x40/9C27B0/FFFFFF?text=H', certification: '운전면허' },
    'user03': { name: 'Khang', profilePic: 'https://placehold.co/40x40/00BCD4/FFFFFF?text=K' },
    'user04': { name: 'Linh', profilePic: 'https://placehold.co/40x40/FF5722/FFFFFF?text=L' },
    'expert01': { name: '김민준 행정사', profilePic: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=E', isExpert: true, certification: '행정사' },
    'expert02': { name: '박서준 변호사', profilePic: 'https://placehold.co/40x40/FFC107/000000?text=E', isExpert: true, certification: '변호사' },
};
const mockPosts = [
    { id: 'post001', title: 'F-2-R 비자, 지역특화형 비자에 대해 궁금합니다.', authorId: 'user01', content: '안녕하세요. 최근에 F-2-R 비자에 대해 알게 되었습니다. 요건이 어떻게 되고, 어떤 지역에서 신청할 수 있는지 경험자분들의 조언을 구합니다.', category: 'Visa/Legal', tags: ['F-2-R', '비자'], createdAt: new Date('2024-07-30T10:00:00'), viewCount: 150, answerCount: 2, likes: 5 },
    { id: 'post002', title: '한국에서 운전면허 교환 발급 절차는 어떻게 되나요?', authorId: 'user02', content: '베트남 면허증을 한국 면허증으로 바꾸고 싶습니다. 필요한 서류와 절차, 소요 기간이 궁금해요.', category: 'Life', tags: ['운전면허', '생활정보'], createdAt: new Date('2024-07-29T14:30:00'), viewCount: 250, answerCount: 1, likes: 10 },
    { id: 'post003', title: 'TOPIK 시험 준비, 효과적인 공부법 좀 알려주세요.', authorId: 'user03', content: '읽기, 듣기, 쓰기 파트별로 어떻게 공부해야 효율적일까요? 점수가 잘 안 올라서 고민입니다.', category: 'Education', tags: ['TOPIK', '공부'], createdAt: new Date('2024-07-28T09:00:00'), viewCount: 300, answerCount: 0, likes: 3 },
    // 새로운 게시글 추가
    { id: 'post004', title: '외국인 근로자 고용 관련 법률 자문 구합니다.', authorId: 'expert01', content: '저희 회사에서 외국인 근로자를 고용하려고 하는데, 관련 법률 및 비자 문제에 대해 전문가의 자문이 필요합니다.', category: 'Employment', tags: ['외국인근로자', '고용', '법률'], createdAt: new Date('2024-07-27T11:00:00'), viewCount: 180, answerCount: 1, likes: 7 },
    { id: 'post005', title: '한국에서 전세 계약 시 주의할 점은 무엇인가요?', authorId: 'user04', content: '처음으로 한국에서 전세 계약을 하려고 합니다. 사기당하지 않으려면 어떤 점을 주의해야 할까요?', category: 'Housing', tags: ['전세', '계약', '부동산'], createdAt: new Date('2024-07-26T16:00:00'), viewCount: 220, answerCount: 0, likes: 2 },
    { id: 'post006', title: '한국 건강보험 외국인 가입 절차 및 혜택 문의', authorId: 'user01', content: '한국 건강보험에 외국인도 가입할 수 있다고 들었습니다. 가입 절차와 어떤 혜택을 받을 수 있는지 궁금합니다.', category: 'Healthcare', tags: ['건강보험', '외국인', '의료'], createdAt: new Date('2024-07-25T09:30:00'), viewCount: 190, answerCount: 0, likes: 8 },
];
const mockAnswers = {
    'post001': [
        { id: 'ans001', authorId: 'user02', content: '저도 작년에 신청해서 받았습니다! 일단 해당 지역에 거주해야 하고, 지자체에서 발급하는 추천서가 필수입니다. 소득 요건도 있으니 공고를 잘 확인해야 해요.', createdAt: new Date('2024-07-30T11:00:00'), likes: 3, isAccepted: false },
        { id: 'ans002', authorId: 'expert01', content: '전문가 의견: F-2-R 비자는 인구감소지역 활성화를 위한 제도로, 지자체별 요건이 상이합니다. 기본적으로 법무부 고시 소득요건(전년도 GNI 70% 이상)과 해당 지자체의 추천서가 핵심입니다. 추천서 발급 기준(취업/창업 분야, 거주 기간 등)을 먼저 확인하시는 것이 중요합니다.', createdAt: new Date('2024-07-30T15:00:00'), likes: 7, isAccepted: true },
    ],
    'post002': [
        { id: 'ans003', authorId: 'user03', content: '대사관에서 베트남 면허증 번역 공증을 받고, 출입국사실증명서, 신분증 등을 챙겨서 가까운 운전면허시험장에 가면 됩니다. 간단한 신체검사 후 바로 발급해줬어요.', createdAt: new Date('2024-07-29T16:00:00'), likes: 2, isAccepted: false },
    ],
};

export async function populateDatabase() {
    const initDocRef = doc(db, '_internal', 'init_status');
    const initDocSnap = await getDoc(initDocRef);
    if (initDocSnap.exists() && initDocSnap.data().populated) return;
    console.log('Start populating Firestore with mock data...');
    const batch = writeBatch(db);
    for (const userId in mockUsers) {
        batch.set(doc(db, 'users', userId), mockUsers[userId]);
    }
    for (const post of mockPosts) {
        const postRef = doc(db, 'posts', post.id);
        const postData = { ...post, createdAt: Timestamp.fromDate(post.createdAt) };
        delete postData.id;
        batch.set(postRef, postData);
        if (mockAnswers[post.id]) {
            for (const answer of mockAnswers[post.id]) {
                const answerRef = doc(db, 'posts', post.id, 'answers', answer.id);
                const answerData = { ...answer, createdAt: Timestamp.fromDate(answer.createdAt) };
                delete answerData.id;
                batch.set(answerRef, answerData);
            }
        }
    }
    batch.set(initDocRef, { populated: true, populatedAt: Timestamp.now() });
    try {
        await batch.commit();
        console.log('Firestore populated successfully!');
    } catch (error) {
        console.error('Error populating Firestore:', error);
    }
}

export async function getUser(userId, usersCache) {
    if (usersCache[userId]) return usersCache[userId];
    try {
        const userSnap = await getDoc(doc(db, 'users', userId));
        if (userSnap.exists()) {
            const userData = userSnap.data();
            usersCache[userId] = userData; // Populate the cache
            return userData;
        }
        return { name: 'Unknown User', profilePic: '' };
    } catch (error) {
        console.error("Error getting user:", error);
        return { name: 'Unknown User', profilePic: '' };
    }
}

export async function fetchHomepagePosts(usersCache) {
    try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(postsQuery);
        const postsPromises = querySnapshot.docs.map(async (doc) => {
            const post = { id: doc.id, ...doc.data() };
            const author = await getUser(post.authorId, usersCache);
            return { ...post, author };
        });
        return await Promise.all(postsPromises);
    } catch (error) {
        console.error("Error fetching homepage posts:", error);
        return [];
    }
}

export async function fetchPostDetails(postId, usersCache) {
    try {
        const postSnap = await getDoc(doc(db, 'posts', postId));
        if (!postSnap.exists()) return null;
        const postData = { id: postSnap.id, ...postSnap.data() };
        const author = await getUser(postData.authorId, usersCache);
        const answersQuery = query(collection(db, 'posts', postId, 'answers'), orderBy('createdAt', 'asc'));
        const answersSnapshot = await getDocs(answersQuery);
        const answersPromises = answersSnapshot.docs.map(async (doc) => {
            const answer = { id: doc.id, ...doc.data() };
            const answerAuthor = await getUser(answer.authorId, usersCache);
            return { ...answer, author: answerAuthor };
        });
        const answers = await Promise.all(answersPromises);
        return { ...postData, author, answers };
    } catch (error) {
        console.error("Error fetching post details:", error);
        return null;
    }
}

export async function fetchPaginatedPosts(filter, sortType, lastVisible, firstVisible, usersCache) {
    try {
        let q = collection(db, 'posts');
        const { type, value } = filter;

        if (type === 'category' && value) {
            q = query(q, where('category', '==', value));
        } else if (type === 'engagement') {
            if (value === 'Unanswered') {
                q = query(q, where('answerCount', '==', 0));
            }
        }

        // sortType을 사용하여 정렬 필드를 결정
        const orderByField = sortType === 'viewCount' ? 'viewCount' : 'createdAt';
        q = query(q, orderBy(orderByField, 'desc'));

        if (lastVisible) {
            q = query(q, startAfter(lastVisible));
        } else if (firstVisible) {
            q = query(q, endBefore(firstVisible), limitToLast(10));
        } else {
            q = query(q, limit(10));
        }
        
        const documentSnapshots = await getDocs(q);
        const posts = [];
        for (const doc of documentSnapshots.docs) {
            const post = { id: doc.id, ...doc.data() };
            const author = await getUser(post.authorId, usersCache);
            posts.push({ ...post, author });
        }

        return {
            posts,
            firstVisible: documentSnapshots.docs[0],
            lastVisible: documentSnapshots.docs[documentSnapshots.docs.length - 1],
        };

    } catch (error) {
        console.error("Error fetching paginated posts:", error);
        return { posts: [], firstVisible: null, lastVisible: null };
    }
}

export async function createQuestion(title, content, currentUser) {
    try {
        const newPost = { title, content, authorId: currentUser.id, createdAt: Timestamp.now(), category: 'General', tags: [], viewCount: 0, answerCount: 0, likes: 0 };
        await addDoc(collection(db, "posts"), newPost);
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e; // Re-throw to be handled by the caller
    }
}

export async function createAnswer(postId, content, currentUser) {
    try {
        const newAnswer = { content, authorId: currentUser.id, createdAt: Timestamp.now(), likes: 0, isAccepted: false };
        await addDoc(collection(db, 'posts', postId, 'answers'), newAnswer);
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e; // Re-throw to be handled by the caller
    }
}

export async function updateLikes(type, id, postId = null) {
    const ref = type === 'post' ? doc(db, 'posts', id) : doc(db, 'posts', postId, 'answers', id);
    try {
        await updateDoc(ref, {
            likes: increment(1)
        });
    } catch (e) {
        console.error("Error updating likes: ", e);
        throw e;
    }
}

export async function acceptAnswer(postId, answerId) {
    const answerRef = doc(db, 'posts', postId, 'answers', answerId);
    try {
        await updateDoc(answerRef, {
            isAccepted: true
        });
    } catch (e) {
        console.error("Error accepting answer: ", e);
        throw e;
    }
}

export async function deletePost(postId) {
    const postRef = doc(db, 'posts', postId);
    try {
        await deleteDoc(postRef);
    } catch (e) {
        console.error("Error deleting post: ", e);
        throw e;
    }
}
