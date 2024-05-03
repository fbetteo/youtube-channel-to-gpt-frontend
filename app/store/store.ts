import { create, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { Assistant, Thread } from '../types/types';

interface GlobalState {
    jwtToken: string,
    subscription: string,
    assistant: Assistant,
    threads: Thread[],
    thread: Thread,
    modifySubscription: (new_subscription: string) => void,
    modifyjwtToken: (jwtToken: string) => Promise<string>,
    modifyAssistant: (assistant: Assistant) => void,
    modifyThreads: (threads: Thread[]) => void,
    modifyThread: (thread: Thread) => void,

}

// The promise in modifyjwtToken was used to resolve the issue of the jwtToken not being updated in time for the axios request in thhe signupform.
// ChatGPT says this way will help await the update of the global store. Not sure if it's the best way but it works for now.

export const useGlobalStore = create<GlobalState>()(persist(
    (set) => ({
        jwtToken: "",
        subscription: "",
        assistant: { id: "", name: "" },
        threads: [{ thread_id:"", thread_name: "" }],
        thread: { thread_id:"", thread_name: "" },
        modifySubscription: (new_subscription: string) => set(() => ({ subscription: new_subscription })),
        modifyjwtToken: (new_jwtToken: string) => {
            return new Promise((resolve) => {
              set({ jwtToken: new_jwtToken });
              resolve(new_jwtToken);
            });
          },
        // modifyjwtToken: (new_jwtToken: string) => set(() => ({ jwtToken: new_jwtToken })),
        modifyAssistant: (new_assistant: Assistant) => set(() => ({ assistant: new_assistant })),
        modifyThreads(threads) {
            set(() => ({ threads: threads }))
        },
        modifyThread: (new_thread: Thread) => set(() => ({ thread: new_thread })),
    }),
    {
        name: 'my-partial-store', // unique name for storage
        getStorage: () => sessionStorage, // or localStorage for longer persistence
        partialize: (state) => ({ jwtToken: state.jwtToken, subscription: state.subscription, assistant: state.assistant, threads: state.threads, thread: state.thread }), 
    }
));