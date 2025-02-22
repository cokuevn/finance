import { Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';

import { Firestore, doc, docData } from '@angular/fire/firestore';

import { BehaviorSubject, switchMap, of, map, from } from 'rxjs';
import { AppUser } from '../../shared/models/app-user.model';

/**
 * AuthService:
 * - login() и logout() возвращают Promise (не Observable).
 * - currentUser$ (Observable) получает актуальную информацию о пользователе,
 *   включая role из Firestore.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Храним текущее состояние пользователя (AppUser | null) в BehaviorSubject
   */
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  /** Публичный поток текущего пользователя */
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // Отслеживаем состояние Firebase Auth
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        // Если пользователь залогинен, подгружаем документ из Firestore
        this.loadUserFromFirestore(user)
          .then((appUser) => {
            this.currentUserSubject.next(appUser);
          })
          .catch(() => {
            this.currentUserSubject.next(null);
          });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Получаем синхронно текущее значение (не поток)
   */
  get currentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Логин (не Observable, а Promise)
   */
  public login(email: string, password: string): any {
    return from(signInWithEmailAndPassword(this.auth, email, password));
    // После логина onAuthStateChanged сам вызовет загрузку пользователя из Firestore
  }

  /**
   * Логаут
   */
  public logout(): any {
    return from(signOut(this.auth));
    // После логаута onAuthStateChanged получит user=null => currentUserSubject.next(null)
  }

  /**
   * Загрузить документ пользователя из Firestore, вернуть AppUser
   */
  private async loadUserFromFirestore(user: User): Promise<AppUser | null> {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    // docData(...) — Observable, но нам нужно 1 раз получить данные => проще напрямую getDoc(...)
    const { getDoc } = await import('@angular/fire/firestore');
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        uid: user.uid,
        email: user.email,
        role: data['role'] ?? 'client',
        // прочие поля при необходимости
      };
    } else {
      return null;
    }
  }
}
