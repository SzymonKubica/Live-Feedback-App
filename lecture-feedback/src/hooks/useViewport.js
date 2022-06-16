import React from "react"

export const useViewport = () => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);

  
    React.useEffect(() => {
      const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }
      window.addEventListener("resize", handleWindowResize);
      return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
  
    // Return the width so we can use it in our components
    return { width, height};
  }