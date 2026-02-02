import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDRE4OGHzLJYNs9bZ3pffsKRzNzcSRAZMk",
  authDomain: "plastsamlaren.firebaseapp.com",
  projectId: "plastsamlaren",
  storageBucket: "plastsamlaren.firebasestorage.app",
  messagingSenderId: "632962696673",
  appId: "1:632962696673:web:96877c68c73bde1e887ea0",
  measurementId: "G-CL0HL55269",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const LEADERBOARD_COLLECTION = 'leaderboard'

export async function submitScore(name: string, score: number, npcsHelped: number) {
  await addDoc(collection(db, LEADERBOARD_COLLECTION), {
    name,
    score,
    npcsHelped,
    createdAt: serverTimestamp(),
  })
}

export interface LeaderboardEntry {
  name: string
  score: number
  npcsHelped: number
}

export async function getTopScores(max = 10): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, LEADERBOARD_COLLECTION),
    orderBy('score', 'desc'),
    limit(max)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      name: data.name,
      score: data.score,
      npcsHelped: data.npcsHelped,
    }
  })
}
