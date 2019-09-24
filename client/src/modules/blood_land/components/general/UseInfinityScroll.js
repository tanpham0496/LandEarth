import { useState, useEffect } from 'react';


const useInfiniteScroll = (callback , id) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        document.getElementById(id) !== null && document.getElementById(id).addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        callback();
    }, [isFetching]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
        setIsFetching(true);
    }

    return [isFetching, setIsFetching];
};

export default useInfiniteScroll