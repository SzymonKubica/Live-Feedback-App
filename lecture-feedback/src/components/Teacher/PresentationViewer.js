/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

 import {
    ChonkyActions,
    ChonkyFileActionData,
    FileArray,
    FileBrowserProps,
    FileData,
    FileHelper,
    FullFileBrowser,
} from 'chonky';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DemoFsMap from './empty.json';
import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center , Input, Box} from "@chakra-ui/react"
import { useNavigate} from "react-router-dom";
import md5 from "md5"



// Helper method to attach our custom TypeScript types to the imported JSON file map.
const prepareCustomFileMap = () => {
    const baseFileMap = DemoFsMap.fileMap;
    const rootFolderId = DemoFsMap.rootFolderId;
    return { baseFileMap, rootFolderId };
};

// Hook that sets up our file map and defines functions used to mutate - `deleteFiles`,
// `moveFiles`, and so on.
const useCustomFileMap = (initial, setInitial) => {
    const { baseFileMap, rootFolderId } = useMemo(prepareCustomFileMap, []);

    // Setup the React state for our file map and the current folder.
    // const [fileMap, setFileMap] = useState({});

    // const [currentFolderId, setCurrentFolderId] = useState("");

    const [fileMap, setFileMap] = useState(baseFileMap);
    const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);

    // Setup the function used to reset our file map to its initial value. Note that
    // here and below we will always use `useCallback` hook for our functions - this is
    // a crucial React performance optimization, read more about it here:
    // https://reactjs.org/docs/hooks-reference.html#usecallback
    // const resetFileMap = useCallback(() => {
    //     setFileMap(baseFileMap);
    //     setCurrentFolderId(rootFolderId);
    // }, [baseFileMap, rootFolderId]);

    // Setup logic to listen to changes in current folder ID without having to update
    // `useCallback` hooks. Read more about it here:
    // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    const currentFolderIdRef = useRef(currentFolderId);
    useEffect(() => {
        if (initial){
            fetch("/api/get-presentations")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setCurrentFolderId(data.rootFolderId)
                setFileMap(data.fileMap)
                console.log("hello")
        
            })
            setInitial(false)
        } else {
            currentFolderIdRef.current = currentFolderId
        }
        

    }, [currentFolderId]);

    // Function that will be called when user creates a new folder using the toolbar
    // button. That that we use incremental integer IDs for new folder, but this is
    // not a good practice in production! Instead, you should use something like UUIDs
    // or MD5 hashes for file paths.
    const idCounter = useRef(0);
    const createFolder = useCallback((folderName) => {
        setFileMap((currentFileMap) => {
            const newFileMap = { ...currentFileMap };

            // Create the new folder
            const newFolderId = `folder-${md5(currentFolderIdRef.current+folderName)}`;
            newFileMap[newFolderId] = {
                id: newFolderId,
                name: folderName,
                isDir: true,
                modDate: new Date(),
                parentId: currentFolderIdRef.current,
                childrenIds: [],
                childrenCount: 0,
            };

            // Update parent folder to reference the new folder.
            const parent = newFileMap[currentFolderIdRef.current];
            newFileMap[currentFolderIdRef.current] = {
                ...parent,
                childrenIds: [...parent.childrenIds, newFolderId],
            };

            return newFileMap;
            // return currentFileMap
        });
    }, []);

    const addVideo = (videoName, code) => {
        
        const newFileMap = { ...fileMap };

        // Create the new video
        const newVideoId = `video-${md5(currentFolderIdRef.current+videoName)}`;
        newFileMap[newVideoId] = {
            id: newVideoId,
            name: videoName,
            modDate: new Date(),
            parentId: currentFolderIdRef.current,
            code: code
        };

        // Update parent folder to reference the new video.
        const parent = newFileMap[currentFolderIdRef.current];
        newFileMap[currentFolderIdRef.current] = {
            ...parent,
            childrenIds: [...parent.childrenIds, newVideoId],
        };
        
        setFileMap(newFileMap)
        
        return newFileMap;
    }

    return {
        fileMap,
        currentFolderId,
        rootFolderId,
        setCurrentFolderId,
        // resetFileMap,
        // deleteFiles,
        // moveFiles,
        addVideo,
        createFolder,
    };
};

export const useFiles = (
    fileMap,
    currentFolderId
) => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId];
        const childrenIds = currentFolder.childrenIds;
        const files = childrenIds.map((fileId) => fileMap[fileId]);
        return files;
    }, [currentFolderId, fileMap]);
};

export const useFolderChain = (
    fileMap,
    currentFolderId
) => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId];

        const folderChain = [currentFolder];

        let parentId = currentFolder.parentId;
        while (parentId) {
            const parentFile = fileMap[parentId];
            if (parentFile) {
                folderChain.unshift(parentFile);
                parentId = parentFile.parentId;
            } else {
                break;
            }
        }

        return folderChain;
    }, [currentFolderId, fileMap]);
};

export const useFileActionHandler = (
    setCurrentFolderId,
    // deleteFiles,
    // moveFiles,
    createFolder
) => {
    return useCallback(
        (data) => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload;
                const fileToOpen = targetFile ?? files[0];
                if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                    setCurrentFolderId(fileToOpen.id);
                    return;
                }
                console.log("Tried to open some file which isn't dir")
                // we have target file too so all good

            } else if (data.id === ChonkyActions.CreateFolder.id) {
                const folderName = prompt('Provide the name for your new folder:');
                if (folderName) createFolder(folderName);
            }

        },
        [createFolder, setCurrentFolderId]
        
        // [createFolder, deleteFiles, moveFiles, setCurrentFolderId]
    );
};

export const PresentationViewer = React.memo((props) => {
    let navigate = useNavigate();

    const [initial, setInitial] = useState(true)
    
    const {
        fileMap,
        currentFolderId,
        rootFolderId,
        setCurrentFolderId,
        // resetFileMap,
        // deleteFiles,
        // moveFiles,
        addVideo,
        createFolder,
    } = useCustomFileMap(initial, setInitial);
    const files = useFiles(fileMap, currentFolderId);
    const folderChain = useFolderChain(fileMap, currentFolderId);
    const handleFileAction = useFileActionHandler(
        setCurrentFolderId,
        // deleteFiles,
        // moveFiles,
        createFolder
    );
    const fileActions = useMemo(
        () => [ChonkyActions.CreateFolder], //[ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles],
        []
    );
    const thumbnailGenerator = useCallback(
        (file) =>
            file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null,
        []
    );

    const handleSave = () => {
        const videoName = prompt('Provide the name for the video');
        const newMap = addVideo(videoName, props.code)
        // save it
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"directory":{"rootFolderId": rootFolderId, "fileMap": newMap}})
        }

        fetch("/api/set-presentations", requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            navigate("/teacher/menu")
        })
    }

    const handleCancel = () => {
        console.log(fileMap)
        navigate("/teacher/menu")
    }

    return (
            <ChakraProvider theme={theme}>
                <Box>
                    <FullFileBrowser
                        files={files}
                        folderChain={folderChain}
                        fileActions={fileActions}
                        onFileAction={handleFileAction}
                        thumbnailGenerator={thumbnailGenerator}
                        {...props}
                    />
                    <Button onClick={handleSave} >Save</Button>
                    <Button onClick={handleCancel} >Cancel</Button>
                </Box>
            </ChakraProvider>
            // </div>
    );
});
