/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

 import {
    ChonkyActions,
    ChonkyIconName,
    ChonkyFileActionData,
    FileArray,
    FileBrowserProps,
    FileData,
    FileHelper,
    FullFileBrowser,
} from 'chonky';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DemoFsMap from './empty.json';
import { ChakraProvider, theme, Button, Box} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
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

    // Called when there is a change made
    const updateBackend = (newFileMap) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"directory":{"rootFolderId": rootFolderId, "fileMap": newFileMap}})
        }

        fetch("/api/set-presentations", requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            console.log(newFileMap)
        })
    }

    // Function that will be called when user deletes files either using the toolbar
    // button or `Delete` key.
    const deleteFiles = useCallback((files) => {
        setFileMap((currentFileMap) => {
            // Create a copy of the file map to make sure we don't mutate it.
            const newFileMap = { ...currentFileMap };

            files.forEach((file) => {
                // Delete file from the file map.
                delete newFileMap[file.id];

                // Update the parent folder to make sure it doesn't try to load the
                // file we just deleted.
                if (file.parentId) {
                    const parent = newFileMap[file.parentId];
                    const newChildrenIds = parent.childrenIds.filter(
                        (id) => id !== file.id
                    );
                    newFileMap[file.parentId] = {
                        ...parent,
                        childrenIds: newChildrenIds,
                        childrenCount: newChildrenIds.length,
                    };
                }
            });
            updateBackend(newFileMap)
            return newFileMap;
        });
        
    }, []);

    // Function that will be called when files are moved from one folder to another
    // using drag & drop.
    const moveFiles = useCallback(
        (
            files,
            source,
            destination
        ) => {
            setFileMap((currentFileMap) => {
                const newFileMap = { ...currentFileMap };
                const moveFileIds = new Set(files.map((f) => f.id));

                // Delete files from their source folder.
                const newSourceChildrenIds = source.childrenIds.filter(
                    (id) => !moveFileIds.has(id)
                );
                newFileMap[source.id] = {
                    ...source,
                    childrenIds: newSourceChildrenIds,
                    childrenCount: newSourceChildrenIds.length,
                };

                // Add the files to their destination folder.
                const newDestinationChildrenIds = [
                    ...destination.childrenIds,
                    ...files.map((f) => f.id),
                ];
                newFileMap[destination.id] = {
                    ...destination,
                    childrenIds: newDestinationChildrenIds,
                    childrenCount: newDestinationChildrenIds.length,
                };

                // Finally, update the parent folder ID on the files from source folder
                // ID to the destination folder ID.
                files.forEach((file) => {
                    newFileMap[file.id] = {
                        ...file,
                        parentId: destination.id,
                    };
                });
                updateBackend(newFileMap)
                return newFileMap;
            });
        },
        []
    );


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
            updateBackend(newFileMap)
            return newFileMap;
            // return currentFileMap
        });
        // updateBackend()
    }, []);

    const addVideo = useCallback((videoName, code) => {
        setFileMap((currentFileMap) => {
            const newFileMap = { ...currentFileMap };

            // Create the new folder
            const newVideoId = `video-${md5(currentFolderIdRef.current+videoName)}`;
            newFileMap[newVideoId] = {
                id: newVideoId,
                name: videoName,
                ext: "",
                modDate: new Date(),
                parentId: currentFolderIdRef.current,
                icon: ChonkyIconName.video,
                code: code
            };

            // Update parent folder to reference the new video.
            const parent = newFileMap[currentFolderIdRef.current];
            newFileMap[currentFolderIdRef.current] = {
                ...parent,
                childrenIds: [...parent.childrenIds, newVideoId],
            };
            updateBackend(newFileMap)
            return newFileMap;
        });
        
    }, [])

    return {
        fileMap,
        currentFolderId,
        rootFolderId,
        setCurrentFolderId,
        deleteFiles,
        moveFiles,
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
    deleteFiles,
    moveFiles,
    createFolder
) => {
    let navigate = useNavigate();

    return useCallback(
        (data) => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload;
                const fileToOpen = targetFile ?? files[0];
                if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                    setCurrentFolderId(fileToOpen.id);
                    return;
                }
                // Must be opening a file (video)
                // console.log(data.payload.targetFile.code)
                const roomCode = data.payload.targetFile.code
                navigate(roomCode)

                console.log("Tried to open some file which isn't dir")
                // we have target file too so all good
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
                deleteFiles(data.state.selectedFilesForAction);
            } else if (data.id === ChonkyActions.MoveFiles.id) {
                moveFiles(
                    data.payload.files,
                    data.payload.source,
                    data.payload.destination
                );
            } else if (data.id === ChonkyActions.CreateFolder.id) {
                const folderName = prompt('Provide the name for your new folder:');
                if (folderName) createFolder(folderName);
            }

        },        
        [createFolder, deleteFiles, moveFiles, setCurrentFolderId]
    );
};

export const PresentationFileFinder = React.memo((props) => {
    let navigate = useNavigate();

    const [initial, setInitial] = useState(true)
    
    const {
        fileMap,
        currentFolderId,
        rootFolderId,
        setCurrentFolderId,
        deleteFiles,
        moveFiles,
        addVideo,
        createFolder,
    } = useCustomFileMap(initial, setInitial);
    const files = useFiles(fileMap, currentFolderId);
    const folderChain = useFolderChain(fileMap, currentFolderId);
    const handleFileAction = useFileActionHandler(
        setCurrentFolderId,
        deleteFiles,
        moveFiles,
        createFolder
    );
    const fileActions = useMemo(
        () => [ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles],
        []
    );
    const thumbnailGenerator = useCallback(
        (file) =>
            file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null,
        []
    );

    const handleSave = () => {
        const videoName = prompt('Provide the name for the video');
        if (videoName && videoName.length !== 0) {
            const newMap = addVideo(videoName, props.code)
            navigate("/teacher/menu")
        } 
        
        // only triggered when press ok not cancel
        if (videoName.length === 0) {
            alert("invalid video name")
        }
        
    }

    const handleNoSave = () => {
        navigate("/teacher/menu")
    }

    return (
            <ChakraProvider theme={theme}>
                <Box width={"50%"} height={400}>
                    <FullFileBrowser
                        files={files}
                        folderChain={folderChain}
                        fileActions={fileActions}
                        onFileAction={handleFileAction}
                        thumbnailGenerator={thumbnailGenerator}
                        {...props}
                    />
                    {props.allowSave ?
                    <Box> 
                        <Button onClick={handleSave} >Save</Button>
                        <Button onClick={handleNoSave} >Don't Save</Button>
                    </Box>
                    : null}
                </Box>
            </ChakraProvider>
            // </div>
    );
});
