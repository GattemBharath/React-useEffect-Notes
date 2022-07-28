import React, { useState, useEffect, useRef } from "react";

/*
  You cannot directly make the callback function supplied to the useEffect hook async because:

  1. async functions implicitly return a promise

  2. useEffect expects its callback to either return nothing or a clean up function.
*/

//! IMPORTANT -  CLEAN UP IN useEffect

/*
  So it's always good practice when we're using useEffect, if we're doing something asynchronous, like
  trying to fetch data or subscribing to some kind of stream of data when the component using 
  that useEffect hook unmounts, return a cleanup function that abort the fetch or stops listening to
  the stream of data or anything like that so that then we're not trying to update any state in that component
  once it's left the DOM.

  The fetch method knows how to work with AbortController. So what it does is that it listens to the abort events on signal.

  To abort, we call //! controller.abort() :

  fetch gets the event from signal and aborts the request.

  When a fetch is aborted, its promise rejects with an error AbortError, so we should handle it, e.g. in try..catch which we do for the above code if you see.

  Clean up function runs AFTER the new render but BEFORE the 'new' effects are applied. So if we abort the fetch question in a cleanup, then you need to understand that it will abort the previous request that was made and not the new one that gets issued as new effect gets activated.

  So in essence, the previous effect is cleaned up first before executing the next effect. This is mainly done for performance optimization so that the rendering process does not suffer any delay.
  

*/

export const useFetch = (url, _options) => {
  // use useRef to wrap an object/array argument
  // which is a useEffect dependency
  const options = useRef(_options).current;
  console.log(options);

  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsPending(true);

      try {
        const res = await fetch(url, { signal: controller.signal });
        // console.log(res);
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const json = await res.json();

        setIsPending(false);
        setData(json);
        setError(null);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("the fetch was aborted");
        } else {
          setIsPending(false);
          setError("Could not fetch data");
          // console.log(error.message);
        }
      }
    };

    fetchData();
    /*
      The cleanup function that we return from useEffect fires whenever the component
      that we're using this usEffect hook in unmounts.
   */

    /*
   So just remember for any reference type objects, arrays and functions.
   If they're used directly as dependencies, they'll trigger an infinite loop.
   */

    return () => {
      controller.abort();
    };
  }, [url, options]);

  return { data, isPending, error };
};
