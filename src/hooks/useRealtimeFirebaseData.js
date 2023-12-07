import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';

export default function useRealtimeFirebaseData(path) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const dbRef = ref(getDatabase(), path);

    const handleData = (snapshot) => {
      if (snapshot.exists()) {
        let realtimeData = snapshot.val();

        if (
          realtimeData &&
          typeof realtimeData === 'object' &&
          !Array.isArray(realtimeData)
        ) {
          realtimeData = Object.keys(realtimeData).map((key) => ({
            id: key,
            ...realtimeData[key],
          }));
        }

        setData(realtimeData);
      } else {
        setData([]);
      }
      setLoading(false);
    };

    const handleError = (error) => {
      console.error('Error fetching profile: ', error);
      setError(error);
      setLoading(false);
    };

    onValue(dbRef, handleData, handleError);

    return () => off(dbRef);
  }, [path]);

  return { data, loading, error };
}
