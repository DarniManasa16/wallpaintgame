// Game state
const gameState = {
    isRunning: false,
    timeRemaining: 180, // 3 minutes in seconds
    players: [
        { id: 1, name: 'Bunny', score: 0, color: '#ff6b6b', turnTime: 60, character: '🐰' },
        { id: 2, name: 'Panda', score: 0, color: '#4ecdc4', turnTime: 60, character: '🐼' },
        { id: 3, name: 'Fox', score: 0, color: '#ffe66d', turnTime: 60, character: '🦊' }
    ],
    currentPlayer: 1,
    gameMode: 'turn-based', // 'turn-based', 'simultaneous', or 'free-paint'
    powerups: {
        rainbow: { count: 3, active: false, duration: 0 },
        mirror: { count: 2, active: false, duration: 0 },
        symmetry: { count: 1, active: false, duration: 0 },
        time: { count: 1, active: false, duration: 0 }
    },
    selectedCharacter: '🐰',
    achievements: {
        'first-star': { unlocked: false, name: 'First Star', description: 'Earn your first star' },
        'rainbow-master': { unlocked: false, name: 'Rainbow Master', description: 'Use all rainbow power-ups' },
        'speed-painter': { unlocked: false, name: 'Speed Painter', description: 'Get a 10x combo' }
    },
    soundEnabled: true,
    currentChallenge: null,
    savedArtworks: [],
    sampleImages: [
        { 
            id: 'house', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMTUwIDUwIEwyNTAgMTUwIEw1MCAxNTAgWiIgZmlsbD0iI2ZmNjY2NiIvPjxyZWN0IHg9IjEwMCIgeT0iMTUwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmNjY2NiIvPjxyZWN0IHg9IjEyMCIgeT0iMTgwIiB3aWR0aD0iMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxNjAiIHk9IjE4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+', 
            title: 'House' 
        },
        { 
            id: 'tree', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSIjNGVjZGM0Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iIzRlY2RjNCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iMzAiIGZpbGw9IiM0ZWNkYzQiLz48cmVjdCB4PSIxNDAiIHk9IjIwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOGI2ZjRjIi8+PC9zdmc+', 
            title: 'Tree' 
        },
        { 
            id: 'sun', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjUwIiBmaWxsPSIjZmZlNjZkIi8+PHBhdGggZD0iTTE1MCA1MCBMMTUwIDMwIE0xNTAgMjUwIEwxNTAgMjcwIE0yNTAgMTUwIEwyNzAgMTUwIE01MCAxNTAgTDMwIDE1MCBNMTk1IDEwNSBMMjA1IDk1IE0xMDUgMTk1IEw5NSAyMDUgTTE5NSAxOTUgTDIwNSAyMDUgTTEwNSAxMDUgTDk1IDk1IiBzdHJva2U9IiNmZmU2NmQiIHN0cm9rZS13aWR0aD0iMTAiLz48L3N2Zz4=', 
            title: 'Sun' 
        },
        { 
            id: 'flower', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSIjZmZmZjAwIi8+PGNpcmNsZSBjeD0iMTIwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iI2ZmNjY2NiIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiNmZjY2NjYiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxODAiIHI9IjIwIiBmaWxsPSIjZmY2NjY2Ii8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTgwIiByPSIyMCIgZmlsbD0iI2ZmNjY2NiIvPjxyZWN0IHg9IjE0NSIgeT0iMTgwIiB3aWR0aD0iMTAiIGhlaWdodD0iODAiIGZpbGw9IiM4YjZmNGMiLz48L3N2Zz4=', 
            title: 'Flower' 
        },
        { 
            id: 'cat', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjgwIiBmaWxsPSIjZmY2NjY2Ii8+PGNpcmNsZSBjeD0iMTIwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iI2ZmZDgwMCIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiNmZmQ4MDAiLz48cGF0aCBkPSJNMTUwIDE4MCBRMTgwIDE4MCAyMDAgMTgwIFEyMjAgMTgwIDIwMCAyMDAgUTIyMCAyMjAgMTUwIDIyMCBRMTIwIDIyMCAxMDAgMjAwIFExMjAgMTgwIDE1MCAxODAgWiIgZmlsbD0iI2ZmNjY2NiIvPjxwYXRoIGQ9Ik0xMDAgMTgwIEwxNTAgMTgwIE0yMDAgMTgwIEwyNTAgMTgwIE0xMDAgMTgwIEwxMDAgMTIwIE0yNTAgMTgwIEwyNTAgMTIwIiBzdHJva2U9IiNGRjY2NjYiIHN0cm9rZS13aWR0aD0iNSIvPjxwYXRoIGQ9Ik0xMDAgMTIwIEwxNTAgMTIwIE0yMDAgMTIwIEwyNTAgMTIwIiBzdHJva2U9IiNGRjY2NjYiIHN0cm9rZS13aWR0aD0iNSIvPjxwYXRoIGQ9Ik0xNTAgMTgwIEwxNTAgMjAwIiBzdHJva2U9IiNGRjY2NjYiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==', 
            title: 'Cat' 
        },
        { 
            id: 'dog', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjgwIiBmaWxsPSIjOGI2ZjRjIi8+PGNpcmNsZSBjeD0iMTIwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMTIwIDE4MEMxNDAgMTgwIDE2MCAxODAgMTgwIDE4MCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwMCAxNjBDMTIwIDE2MCAxNDAgMTYwIDE2MCAxNjAiIHN0cm9rZT0iIzAwMDAwMCIgc3Rva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwMCAxNDBDMTIwIDE0MCAxNDAgMTQwIDE2MCAxNDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Rva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIi8+PC9zdmc+', 
            title: 'Dog' 
        },
        { 
            id: 'bird', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjQwIiBmaWxsPSIjZmZmZjAwIi8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iMTQwIiByPSIxMCIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjE3MCIgY3k9IjE0MCIgcj0iMTAiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMTUwIDE5MCBRMTgwIDE5MCAyMDAgMTkwIFEyMjAgMTkwIDIwMCAyMTAgUTIyMCAyMzAgMTUwIDIzMCBRMTIwIDIzMCAxMDAgMjEwIFExMjAgMTkwIDE1MCAxOTAgWiIgZmlsbD0iI2ZmZmYwMCIvPjxwYXRoIGQ9Ik0xMDAgMTUwIEwxNTAgMTUwIE0yMDAgMTUwIEwyNTAgMTUwIiBzdHJva2U9IiNmZmZmMDAiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==', 
            title: 'Bird' 
        },
        { 
            id: 'fish', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMTUwIDE1MCBRMTgwIDE1MCAyMDAgMTUwIFEyMjAgMTUwIDIwMCAxNzAgUTIyMCAxOTAgMTUwIDE5MCBRMTIwIDE5MCAxMDAgMTcwIFExMjAgMTUwIDE1MCAxNTAgWiIgZmlsbD0iIzU0YTBmZiIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjE0MCIgcj0iMTAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMjAwIDE1MCBMNDAgMTUwIE0yMDAgMTUwIEwyMDAgMTMwIE0yMDAgMTUwIEwyMDAgMTcwIiBzdHJva2U9IiM1NGEwZmYiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==', 
            title: 'Fish' 
        },
        { 
            id: 'car', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSI1MCIgeT0iMTUwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmY2NjY2Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMjMwIiByPSIzMCIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIzMCIgcj0iMzAiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSI3MCIgeT0iMTMwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmY2NjY2Ii8+PC9zdmc+', 
            title: 'Car' 
        },
        { 
            id: 'boat', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNNTAgMTgwIEwyNTAgMTgwIEwyMDAgMjgwIEwxMDAgMjgwIFoiIGZpbGw9IiM4YjZmNGMiLz48cmVjdCB4PSIxNDAiIHk9IjEwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOGI2ZjRjIi8+PHBhdGggZD0iTTE0MCAxMDAgTDE2MCAxMDAgTDE1MCAxODAgWiIgZmlsbD0iIzhiNmY0YyIvPjwvc3ZnPg==', 
            title: 'Boat' 
        },
        { 
            id: 'rainbow', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNNTAgMTUwIEExMDAgMTAwIDAgMCAxIDI1MCAxNTAiIHN0cm9rZT0iI2ZmMDAwMCIgc3Ryb2tlLXdpZHRoPSIyMCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik01MCAxNzAgQTgwIDgwIDAgMCAxIDI1MCAxNzAiIHN0cm9rZT0iI2ZmYTUwMCIgc3Ryb2tlLXdpZHRoPSIyMCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik01MCAxOTAgQTYwIDYwIDAgMCAxIDI1MCAxOTAiIHN0cm9rZT0iI2ZmZmYwMCIgc3Ryb2tlLXdpZHRoPSIyMCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik01MCAyMTAgQTQwIDQwIDAgMCAxIDI1MCAyMTAiIHN0cm9rZT0iIzAwZmYwMCIgc3Ryb2tlLXdpZHRoPSIyMCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik01MCAyMzAgQTIwIDIwIDAgMCAxIDI1MCAyMzAiIHN0cm9rZT0iIzAwMDBmZiIgc3Ryb2tlLXdpZHRoPSIyMCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==', 
            title: 'Rainbow' 
        },
        { 
            id: 'star', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMTUwIDUwIEwxODAgMTIwIEwyNTAgMTIwIEwxOTAgMTYwIEwyMDAgMjMwIEwxNTAgMTkwIEwxMDAgMjMwIEwxMTAgMTYwIEw1MCAxMjAgTDEyMCAxMjAgWiIgZmlsbD0iI2ZmZTg2ZCIvPjwvc3ZnPg==', 
            title: 'Star' 
        },
        { 
            id: 'heart', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMTUwIDgwQzEyMCA4MCAxMDAgMTIwIDEwMCAxNTBDMTAwIDE4MCAxMjAgMjIwIDE1MCAyMjBDMTgwIDIyMCAyMDAgMTgwIDIwMCAxNTBDMjAwIDEyMCAxODAgODAgMTUwIDgwWiIgZmlsbD0iI2ZmNjI2MiIvPjxwYXRoIGQ9Ik0xNTAgODBDMTgwIDgwIDIwMCAxMjAgMjAwIDE1MEMyMDAgMTgwIDE4MCAyMjAgMTUwIDIyMEMxMjAgMjIwIDEwMCAxODAgMTAwIDE1MEMxMDAgMTIwIDEyMCA4MCAxNTAgODBaIiBmaWxsPSIjZmY2MjYyIi8+PC9zdmc+', 
            title: 'Heart' 
        },
        { 
            id: 'butterfly', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMTUwIDE1MCBRMTUwIDEwMCAxMDAgMTAwIFE1MCAxMDAgNTAgMTUwIFE1MCAyMDAgMTAwIDIwMCBRMTUwIDIwMCAxNTAgMTUwIFoiIGZpbGw9IiNhNzhjZmEiLz48cGF0aCBkPSJNMTUwIDE1MCBRMTUwIDEwMCAyMDAgMTAwIFEyNTAgMTAwIDI1MCAxNTAgUTI1MCAyMDAgMjAwIDIwMCBRMTUwIDIwMCAxNTAgMTUwIFoiIGZpbGw9IiNhNzhjZmEiLz48cmVjdCB4PSIxNDAiIHk9IjE0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTE1MCAxNTAgTDE1MCAyMDAiIHN0cm9rZT0iI2E3OGNmYSIgc3Ryb2tlLXdpZHRoPSI1Ii8+PC9zdmc+', 
            title: 'Butterfly' 
        },
        { 
            id: 'robot', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxMDAiIHk9IjEwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM4YjZmNGMiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMzAiIHI9IjEwIiBmaWxsPSIjMDAwMDAwIi8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTMwIiByPSIxMCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjEyMCIgeT0iMTYwIiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxMDAiIHk9IjIwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjOGI2ZjRjIi8+PHJlY3QgeD0iMTgwIiB5PSIyMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzhiNmY0YyIvPjwvc3ZnPg==', 
            title: 'Robot' 
        },
        { 
            id: 'unicorn', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjgwIiBmaWxsPSIjYTc4YmZhIi8+PGNpcmNsZSBjeD0iMTIwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMTIwIDE4MEMxNDAgMTgwIDE2MCAxODAgMTgwIDE4MCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwMCAxNjBDMTIwIDE2MCAxNDAgMTYwIDE2MCAxNjAiIHN0cm9rZT0iIzAwMDAwMCIgc3Rva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwMCAxNDBDMTIwIDE0MCAxNDAgMTQwIDE2MCAxNDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Rva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE1MCAxMDBMMTUwIDUwIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMTUiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI0MCIgcj0iMjAiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=', 
            title: 'Unicorn' 
        },
        { 
            id: 'dragon', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMTUwIDEwMEMxMjAgMTIwIDEwMCAxNTAgMTAwIDE4MEMxMDAgMjEwIDEyMCAyNDAgMTUwIDI0MEMxODAgMjQwIDIwMCAyMTAgMjAwIDE4MEMyMDAgMTUwIDE4MCAxMjAgMTUwIDEwMFoiIGZpbGw9IiNmZjYyNjIiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxNDAiIHI9IjEwIiBmaWxsPSIjMDAwMDAwIi8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTQwIiByPSIxMCIgZmlsbD0iIzAwMDAwMCIvPjxwYXRoIGQ9Ik0xMDAgMTgwQzEyMCAxNjAgMTQwIDE2MCAxNjAgMTgwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMTAiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUwIDEwMEwxNTAgNTBMMjAwIDUwTDIwMCAxMDAiIHN0cm9rZT0iI2ZmNjI2MiIgc3Ryb2tlLXdpZHRoPSIxNSIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xNTAgMTAwTDEwMCAxMDBMMTAwIDE1MEwxNTAgMTUwIiBzdHJva2U9IiNmZjYyNjIiIHN0cm9rZS13aWR0aD0iMTUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=', 
            title: 'Dragon' 
        },
        { 
            id: 'castle', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSI1MCIgeT0iMTUwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmNjY2NiIvPjxwYXRoIGQ9Ik01MCAxNTAgTDE1MCA1MCBMNTAgNTAgWiIgZmlsbD0iI2ZmNjY2NiIvPjxwYXRoIGQ9Ik0xNTAgNTAgTDI1MCAxNTAgTDI1MCA1MCBaIiBmaWxsPSIjZmY2NjY2Ii8+PHJlY3QgeD0iODAiIHk9IjE1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOGI2ZjRjIi8+PHJlY3QgeD0iMTgwIiB5PSIxNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzhiNmY0YyIvPjwvc3ZnPg==', 
            title: 'Castle' 
        },
        { 
            id: 'forest', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjE1MCIgcj0iMzAiIGZpbGw9IiM0ZWNkYzQiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjNGVjZGM0Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSI1MCIgZmlsbD0iIzRlY2RjNCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM0ZWNkYzQiLz48Y2lyY2xlIGN4PSIyNTAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjNGVjZGM0Ii8+PHJlY3QgeD0iNDAiIHk9IjE4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjOGI2ZjRjIi8+PHJlY3QgeD0iOTAiIHk9IjE0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjOGI2ZjRjIi8+PHJlY3QgeD0iMTQwIiB5PSIxODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzhiNmY0YyIvPjxyZWN0IHg9IjE5MCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iNjAiIGZpbGw9IiM4YjZmNGMiLz48cmVjdCB4PSIyNDAiIHk9IjE4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjOGI2ZjRjIi8+PC9zdmc+', 
            title: 'Forest' 
        },
        { 
            id: 'ocean', 
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIwIiB5PSIxMDAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNTRhMGZmIi8+PHBhdGggZD0iTTAgMTIwQzUwIDEwMCAxMDAgMTIwIDE1MCAxMDBDMjAwIDEyMCAyNTAgMTAwIDMwMCAxMjAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMTQwQzUwIDEyMCAxMDAgMTQwIDE1MCAxMjBDMjAwIDE0MCAyNTAgMTIwIDMwMCAxNDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Rva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAxNjBDNTAgMTQwIDEwMCAxNjAgMTUwIDE0MEMyMDAgMTYwIDI1MCAxNDAgMzAwIDE2MCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAxODBDNTAgMTYwIDEwMCAxODAgMTUwIDE2MEMyMDAgMTgwIDI1MCAxNjAgMzAwIDE4MCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAyMDBDNTAgMTgwIDEwMCAyMDAgMTUwIDE4MEMyMDAgMjAwIDI1MCAxODAgMzAwIDIwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=', 
            title: 'Ocean' 
        }
    ],
    currentSampleImageIndex: 0,
    currentDrawingScore: 0,
    maxDrawingScore: 100
};

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set up canvas
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Painting variables
let isPainting = false;
let lastX = 0;
let lastY = 0;
let currentTool = 'brush';
let activeEffects = {
    rainbow: false,
    mirror: false,
    symmetry: false
};
let hue = 0;
let lastDrawTime = 0;
let particles = [];
let score = 0;
let combo = 0;
let lastScoreTime = 0;

// UI Elements
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const toolButtons = document.querySelectorAll('.tool-button');
const powerupButtons = document.querySelectorAll('.powerup');
const gameTimer = document.querySelector('.game-timer');
const gameStatus = document.querySelector('.game-status');
const playerScore = document.querySelector('.player-score');
const gameMessage = document.getElementById('gameMessage');
const gameOverModal = document.getElementById('gameOverModal');
const playAgainButton = document.getElementById('playAgainButton');
const characterButtons = document.querySelectorAll('.character');
const achievementModal = document.getElementById('achievementModal');
const achievementText = document.getElementById('achievementText');
const achievementCloseButton = document.getElementById('achievementCloseButton');
const soundToggle = document.getElementById('soundToggle');
const challengeItems = document.querySelectorAll('.challenge-item');
const sampleImageContainer = document.getElementById('sampleImageContainer');
const sampleImage = document.getElementById('sampleImage');
const prevImageButton = document.getElementById('prevImageButton');
const nextImageButton = document.getElementById('nextImageButton');
const checkDrawingButton = document.getElementById('checkDrawingButton');
const drawingScore = document.getElementById('drawingScore');

// Sound elements
const brushSound = document.getElementById('brushSound');
const spraySound = document.getElementById('spraySound');
const eraserSound = document.getElementById('eraserSound');
const fillSound = document.getElementById('fillSound');
const powerupSound = document.getElementById('powerupSound');
const achievementSound = document.getElementById('achievementSound');
const gameOverSound = document.getElementById('gameOverSound');

// Character selection
characterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove selected class from all characters
        characterButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selected class to clicked character
        button.classList.add('selected');
        
        // Update selected character
        gameState.selectedCharacter = button.textContent;
        
        // Update player avatar
        document.querySelector('.player-avatar').textContent = gameState.selectedCharacter;
        
        // Update player name based on character
        const characterNames = {
            '🐰': 'Bunny',
            '🐼': 'Panda',
            '🦊': 'Fox',
            '🦄': 'Unicorn',
            '🐯': 'Tiger',
            '🐬': 'Dolphin'
        };
        
        document.querySelector('.player-name').textContent = characterNames[gameState.selectedCharacter];
        
        // Update player in the list
        const playerItems = document.querySelectorAll('.player-item');
        playerItems[0].querySelector('.player-item-avatar').textContent = gameState.selectedCharacter;
        playerItems[0].querySelector('.player-item-name').textContent = characterNames[gameState.selectedCharacter];
        
        // Show selection message
        showMessage(`You chose ${characterNames[gameState.selectedCharacter]}!`);
        
        // Play sound
        playSound(powerupSound);
    });
});

// Sound toggle
soundToggle.addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    soundToggle.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    showMessage(gameState.soundEnabled ? 'Sound on!' : 'Sound off!');
});

// Play sound function
function playSound(sound) {
    if (gameState.soundEnabled) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play error:', e));
    }
}

// Challenge selection
challengeItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all challenges
        challengeItems.forEach(challenge => challenge.classList.remove('active'));
        
        // Add active class to clicked challenge
        item.classList.add('active');
        
        // Set current challenge
        gameState.currentChallenge = item.dataset.challenge;
        
        // Show challenge message
        const challengeMessages = {
            'draw-house': 'Draw a house!',
            'draw-tree': 'Draw a tree!',
            'draw-sun': 'Draw the sun!',
            'draw-flower': 'Draw a flower!',
            'draw-cat': 'Draw a cat!',
            'draw-dog': 'Draw a dog!',
            'draw-bird': 'Draw a bird!',
            'draw-fish': 'Draw a fish!',
            'draw-car': 'Draw a car!',
            'draw-boat': 'Draw a boat!',
            'draw-rainbow': 'Draw a rainbow!',
            'draw-star': 'Draw a star!',
            'draw-heart': 'Draw a heart!',
            'draw-butterfly': 'Draw a butterfly!',
            'draw-robot': 'Draw a robot!',
            'draw-unicorn': 'Draw a unicorn!',
            'draw-dragon': 'Draw a dragon!',
            'draw-castle': 'Draw a castle!',
            'draw-forest': 'Draw a forest!',
            'draw-ocean': 'Draw an ocean!'
        };
        
        showMessage(challengeMessages[gameState.currentChallenge]);
        
        // Show sample image if available
        const challengeId = gameState.currentChallenge.replace('draw-', '');
        const sampleImageIndex = gameState.sampleImages.findIndex(img => img.id === challengeId);
        
        if (sampleImageIndex !== -1) {
            gameState.currentSampleImageIndex = sampleImageIndex;
            updateSampleImage();
            sampleImageContainer.style.display = 'block';
        } else {
            sampleImageContainer.style.display = 'none';
        }
        
        // Play sound
        playSound(powerupSound);
    });
});

// Sample image navigation
prevImageButton.addEventListener('click', () => {
    gameState.currentSampleImageIndex = (gameState.currentSampleImageIndex - 1 + gameState.sampleImages.length) % gameState.sampleImages.length;
    updateSampleImage();
    playSound(powerupSound);
});

nextImageButton.addEventListener('click', () => {
    gameState.currentSampleImageIndex = (gameState.currentSampleImageIndex + 1) % gameState.sampleImages.length;
    updateSampleImage();
    playSound(powerupSound);
});

function updateSampleImage() {
    const currentImage = gameState.sampleImages[gameState.currentSampleImageIndex];
    
    // Add loading state
    sampleImage.classList.add('loading');
    
    // Update the sample image source and alt text
    sampleImage.src = currentImage.url;
    sampleImage.alt = currentImage.title;
    
    // Remove loading state when image is loaded
    sampleImage.onload = () => {
        sampleImage.classList.remove('loading');
        console.log(`Successfully loaded: ${currentImage.title}`);
    };
    
    // Handle loading errors
    sampleImage.onerror = (error) => {
        sampleImage.classList.remove('loading');
        console.error(`Error loading image: ${currentImage.title}`, error);
        showMessage(`Error loading ${currentImage.title} image. Please try again.`);
    };
    
    // Update the title to show what to draw
    const sampleTitle = document.querySelector('.sample-image-viewer h3');
    if (sampleTitle) {
        sampleTitle.textContent = `Draw a ${currentImage.title}!`;
    }
    
    // Reset drawing score
    drawingScore.textContent = '';
    
    // Make sure the sample image is visible
    sampleImage.style.display = 'block';
}

// Tool functions
function drawBrush(x, y, size, color) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Add score for drawing
    addScore(1);
    
    // Play sound
    playSound(brushSound);
}

function drawSpray(x, y, size, color) {
    const density = 50;
    for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * size;
        const sprayX = x + radius * Math.cos(angle);
        const sprayY = y + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(sprayX, sprayY, size / 10, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    // Add score for spray painting
    addScore(2);
    
    // Play sound
    playSound(spraySound);
}

function drawEraser(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Play sound
    playSound(eraserSound);
}

function fillCanvas(x, y, color) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Get the color at the clicked position
    const targetColor = {
        r: pixels[(y * canvas.width + x) * 4],
        g: pixels[(y * canvas.width + x) * 4 + 1],
        b: pixels[(y * canvas.width + x) * 4 + 2],
        a: pixels[(y * canvas.width + x) * 4 + 3]
    };
    
    // Convert hex color to RGB
    const fillColor = hexToRgb(color);
    
    // Flood fill algorithm
    const stack = [[x, y]];
    let filledPixels = 0;
    
    while (stack.length > 0) {
        const [currentX, currentY] = stack.pop();
        const pos = (currentY * canvas.width + currentX) * 4;
        
        // Check if we're still within bounds and if the pixel matches the target color
        if (currentX < 0 || currentX >= canvas.width || currentY < 0 || currentY >= canvas.height) continue;
        if (pixels[pos] !== targetColor.r || pixels[pos + 1] !== targetColor.g || 
            pixels[pos + 2] !== targetColor.b || pixels[pos + 3] !== targetColor.a) continue;
        
        // Set the pixel to the fill color
        pixels[pos] = fillColor.r;
        pixels[pos + 1] = fillColor.g;
        pixels[pos + 2] = fillColor.b;
        pixels[pos + 3] = 255;
        
        filledPixels++;
        
        // Add adjacent pixels to the stack
        stack.push([currentX + 1, currentY]);
        stack.push([currentX - 1, currentY]);
        stack.push([currentX, currentY + 1]);
        stack.push([currentX, currentY - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add score based on area filled
    addScore(Math.min(filledPixels / 100, 10));
    
    // Play sound
    playSound(fillSound);
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
}

// Effect functions
function applyRainbow() {
    // Update hue for rainbow effect
    hue = (hue + 1) % 360;
    return `hsl(${hue}, 100%, 50%)`;
}

function applyMirror(x, y, size, color) {
    // Draw on the opposite side of the canvas
    const mirrorX = canvas.width - x;
    if (currentTool === 'brush') {
        drawBrush(mirrorX, y, size, color);
    } else if (currentTool === 'spray') {
        drawSpray(mirrorX, y, size, color);
    } else if (currentTool === 'eraser') {
        drawEraser(mirrorX, y, size);
    }
}

function applySymmetry(x, y, size, color) {
    // Draw in 4 symmetrical points
    const points = [
        {x: x, y: y},
        {x: canvas.width - x, y: y},
        {x: x, y: canvas.height - y},
        {x: canvas.width - x, y: canvas.height - y}
    ];
    
    // Draw at each point
    points.forEach(point => {
        if (currentTool === 'brush') {
            drawBrush(point.x, point.y, size, color);
        } else if (currentTool === 'spray') {
            drawSpray(point.x, point.y, size, color);
        } else if (currentTool === 'eraser') {
            drawEraser(point.x, point.y, size);
        }
    });
}

// Painting functions
function startPosition(e) {
    if (!gameState.isRunning && gameState.gameMode !== 'free-paint') return;
    
    isPainting = true;
    
    // Get canvas position and size
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Calculate correct coordinates
    lastX = (e.clientX - rect.left) * scaleX;
    lastY = (e.clientY - rect.top) * scaleY;
    
    // Handle fill tool
    if (currentTool === 'fill') {
        fillCanvas(lastX, lastY, colorPicker.value);
        isPainting = false;
    }
}

function endPosition() {
    isPainting = false;
    
    // Reset combo if not painting for a while
    setTimeout(() => {
        if (!isPainting) {
            combo = 0;
        }
    }, 1000);
}

function draw(e) {
    if (!isPainting || (!gameState.isRunning && gameState.gameMode !== 'free-paint')) return;
    
    // In turn-based mode, only allow current player to paint
    if (gameState.gameMode === 'turn-based') {
        const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
        if (currentPlayer.id !== gameState.currentPlayer) return;
    }
    
    // Get canvas position and size
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Calculate correct coordinates
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const size = parseInt(brushSize.value);
    let color = colorPicker.value;
    
    // Apply rainbow effect if active
    if (activeEffects.rainbow) {
        color = applyRainbow();
    }
    
    // Draw based on current tool
    if (currentTool === 'brush') {
        // Draw a line between the last position and current position
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        // Also draw a circle at the current position for smoother lines
        ctx.beginPath();
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Add score for drawing
        addScore(1);
    } else if (currentTool === 'spray') {
        drawSpray(x, y, size, color);
    } else if (currentTool === 'eraser') {
        // Draw a line with white color to erase
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        // Also draw a circle at the current position for smoother erasing
        ctx.beginPath();
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    
    // Apply mirror effect if active
    if (activeEffects.mirror) {
        applyMirror(x, y, size, color);
    }
    
    // Apply symmetry effect if active
    if (activeEffects.symmetry) {
        applySymmetry(x, y, size, color);
    }
    
    [lastX, lastY] = [x, y];
}

// Game functions
function startGame() {
    gameState.isRunning = true;
    gameState.currentPlayer = 1;
    gameState.players.forEach(player => {
        player.score = 0;
        player.turnTime = 60; // 1 minute per turn
    });
    
    if (gameState.gameMode === 'turn-based') {
        gameState.timeRemaining = gameState.players[0].turnTime;
    } else if (gameState.gameMode === 'simultaneous') {
        gameState.timeRemaining = 180; // 3 minutes for simultaneous mode
    } else if (gameState.gameMode === 'free-paint') {
        gameState.timeRemaining = 0; // No timer for free paint mode
    }
    
    // Reset powerups
    Object.keys(gameState.powerups).forEach(key => {
        gameState.powerups[key].active = false;
        gameState.powerups[key].duration = 0;
    });
    
    // Clear canvas
    clearCanvas();
    
    // Update UI
    updateScore();
    updateTimer();
    updatePlayerTurn();
    gameStatus.textContent = gameState.gameMode === 'turn-based' ? 'Take turns painting!' : 
                            gameState.gameMode === 'simultaneous' ? 'Paint together!' : 
                            'Free Paint Mode!';
    
    // Start countdown
    showMessage('Let\'s start painting in 3...');
    setTimeout(() => {
        showMessage('2...');
        setTimeout(() => {
            showMessage('1...');
            setTimeout(() => {
                const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
                showMessage(`${currentPlayer.name}'s turn!`);
                setTimeout(() => {
                    gameMessage.classList.add('hidden');
                    startGameTimer();
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

function endGame() {
    gameState.isRunning = false;
    
    // Play game over sound
    playSound(gameOverSound);
    
    // Find winner
    const winner = gameState.players.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
    );
    
    // Show game over modal
    document.querySelector('.modal-title').textContent = 'Great Job!';
    document.querySelector('.modal-text').textContent = `${winner.name} wins with ${winner.score} stars! 🎉`;
    gameOverModal.classList.remove('hidden');
    
    // Update game status
    gameStatus.textContent = 'Painting time is over!';
    
    // Save artwork to local storage
    saveArtworkToLocalStorage();
}

function startGameTimer() {
    if (gameState.gameMode === 'free-paint') return;
    
    const timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimer();
        
        if (gameState.timeRemaining <= 0) {
            if (gameState.gameMode === 'turn-based') {
                // Switch turns in turn-based mode
                switchTurn();
            } else {
                // End game in simultaneous mode
                clearInterval(timerInterval);
                endGame();
            }
        }
    }, 1000);
}

function updateTimer() {
    if (gameState.gameMode === 'free-paint') {
        gameTimer.textContent = '∞';
        return;
    }
    
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    gameTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Flash timer when low on time
    if (gameState.timeRemaining <= 30) {
        gameTimer.style.color = '#ff6b6b';
        gameTimer.style.animation = 'pulse 1s infinite';
    }
}

function addScore(points) {
    // Increase combo
    combo++;
    
    // Calculate score with combo multiplier
    const comboMultiplier = Math.min(combo / 10, 3);
    const scoreToAdd = Math.floor(points * comboMultiplier);
    
    // Add to player score
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
    currentPlayer.score += scoreToAdd;
    
    // Update UI
    updateScore();
    
    // Check for achievements
    checkAchievements();
    
    // Show combo message
    if (combo > 10) {
        showMessage(`${combo}x Combo!`);
    }
    
    // Reset combo timer
    lastScoreTime = Date.now();
}

function updateScore() {
    // Update player score display
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
    playerScore.textContent = `Stars: ${currentPlayer.score}`;
    
    // Update player list
    const playerItems = document.querySelectorAll('.player-item');
    playerItems.forEach((item, index) => {
        const player = gameState.players[index];
        if (player) {
            item.querySelector('.player-item-score').textContent = player.score;
        }
    });
}

function showMessage(message) {
    gameMessage.textContent = message;
    gameMessage.classList.remove('hidden');
    
    // Reset animation
    gameMessage.style.animation = 'none';
    gameMessage.offsetHeight; // Trigger reflow
    gameMessage.style.animation = 'bounceIn 0.5s forwards';
}

// Achievement functions
function checkAchievements() {
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
    
    // First Star achievement
    if (currentPlayer.score >= 1 && !gameState.achievements['first-star'].unlocked) {
        unlockAchievement('first-star');
    }
    
    // Rainbow Master achievement
    if (gameState.powerups.rainbow.count === 0 && !gameState.achievements['rainbow-master'].unlocked) {
        unlockAchievement('rainbow-master');
    }
    
    // Speed Painter achievement
    if (combo >= 10 && !gameState.achievements['speed-painter'].unlocked) {
        unlockAchievement('speed-painter');
    }
}

function unlockAchievement(achievementId) {
    if (gameState.achievements[achievementId].unlocked) return;
    
    // Mark achievement as unlocked
    gameState.achievements[achievementId].unlocked = true;
    
    // Update UI
    const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
    achievementElement.classList.remove('locked');
    
    // Show achievement modal
    achievementText.textContent = `You unlocked: ${gameState.achievements[achievementId].name}!`;
    achievementModal.classList.remove('hidden');
    
    // Play achievement sound
    playSound(achievementSound);
    
    // Save achievements to local storage
    saveAchievementsToLocalStorage();
}

// Powerup functions
function activatePowerup(powerupName) {
    if (!gameState.isRunning && gameState.gameMode !== 'free-paint') return;
    
    const powerup = gameState.powerups[powerupName];
    
    if (powerup.count > 0 && !powerup.active) {
        // Activate powerup
        powerup.active = true;
        powerup.count--;
        powerup.duration = 10; // 10 seconds
        
        // Update UI
        updatePowerupUI();
        
        // Show activation message
        const powerupMessages = {
            rainbow: 'Rainbow colors activated!',
            mirror: 'Mirror magic activated!',
            symmetry: 'Symmetry spell activated!',
            time: 'Extra time added!'
        };
        
        showMessage(powerupMessages[powerupName]);
        
        // Play powerup sound
        playSound(powerupSound);
        
        // Apply effect
        if (powerupName === 'rainbow') {
            activeEffects.rainbow = true;
        } else if (powerupName === 'mirror') {
            activeEffects.mirror = true;
        } else if (powerupName === 'symmetry') {
            activeEffects.symmetry = true;
        } else if (powerupName === 'time') {
            // Add 30 seconds to timer
            gameState.timeRemaining += 30;
            updateTimer();
        }
        
        // Start powerup timer
        const powerupInterval = setInterval(() => {
            powerup.duration--;
            
            if (powerup.duration <= 0) {
                clearInterval(powerupInterval);
                deactivatePowerup(powerupName);
            }
        }, 1000);
    }
}

function deactivatePowerup(powerupName) {
    const powerup = gameState.powerups[powerupName];
    powerup.active = false;
    
    // Remove effect
    if (powerupName === 'rainbow') {
        activeEffects.rainbow = false;
    } else if (powerupName === 'mirror') {
        activeEffects.mirror = false;
    } else if (powerupName === 'symmetry') {
        activeEffects.symmetry = false;
    }
    
    // Show deactivation message
    const powerupEndMessages = {
        rainbow: 'Rainbow colors ended!',
        mirror: 'Mirror magic ended!',
        symmetry: 'Symmetry spell ended!',
        time: 'Extra time ended!'
    };
    
    showMessage(powerupEndMessages[powerupName]);
}

function updatePowerupUI() {
    powerupButtons.forEach(button => {
        const powerupName = button.dataset.powerup;
        const powerup = gameState.powerups[powerupName];
        
        // Update count
        const countElement = button.querySelector('.powerup-count');
        countElement.textContent = powerup.count;
        
        // Update active state
        if (powerup.active) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
        
        // Disable button if no powerups left
        if (powerup.count <= 0) {
            button.disabled = true;
            button.style.opacity = '0.5';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
        }
    });
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reset any active effects
    activeEffects.rainbow = false;
    activeEffects.mirror = false;
    activeEffects.symmetry = false;
    
    // Update powerup UI
    updatePowerupUI();
    
    // Show message
    showMessage('Canvas cleared!');
}

// Save canvas
function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'my-painting.png';
    link.href = canvas.toDataURL();
    link.click();
    
    // Save to local storage
    saveArtworkToLocalStorage();
    
    // Show message
    showMessage('Your art has been saved!');
}

// Local storage functions
function saveArtworkToLocalStorage() {
    const artwork = {
        data: canvas.toDataURL(),
        date: new Date().toISOString(),
        character: gameState.selectedCharacter
    };
    
    gameState.savedArtworks.push(artwork);
    
    // Limit to 5 saved artworks
    if (gameState.savedArtworks.length > 5) {
        gameState.savedArtworks.shift();
    }
    
    localStorage.setItem('kidsPaintPartyArtworks', JSON.stringify(gameState.savedArtworks));
}

function saveAchievementsToLocalStorage() {
    localStorage.setItem('kidsPaintPartyAchievements', JSON.stringify(gameState.achievements));
}

function loadFromLocalStorage() {
    // Load achievements
    const savedAchievements = localStorage.getItem('kidsPaintPartyAchievements');
    if (savedAchievements) {
        gameState.achievements = JSON.parse(savedAchievements);
        
        // Update UI
        Object.keys(gameState.achievements).forEach(achievementId => {
            const achievement = gameState.achievements[achievementId];
            const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
            
            if (achievement.unlocked) {
                achievementElement.classList.remove('locked');
            } else {
                achievementElement.classList.add('locked');
            }
        });
    }
    
    // Load saved artworks
    const savedArtworks = localStorage.getItem('kidsPaintPartyArtworks');
    if (savedArtworks) {
        gameState.savedArtworks = JSON.parse(savedArtworks);
    }
}

// Event listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', endPosition);
clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvas);
playAgainButton.addEventListener('click', () => {
    gameOverModal.classList.add('hidden');
    startGame();
});
achievementCloseButton.addEventListener('click', () => {
    achievementModal.classList.add('hidden');
});

// Tool selection
toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        toolButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentTool = button.dataset.tool;
        
        // Show tool selection message
        const toolMessages = {
            brush: 'Brush selected!',
            spray: 'Spray selected!',
            eraser: 'Eraser selected!',
            fill: 'Fill tool selected!'
        };
        
        showMessage(toolMessages[currentTool]);
        
        // Play sound
        playSound(powerupSound);
    });
});

// Powerup activation
powerupButtons.forEach(button => {
    button.addEventListener('click', () => {
        const powerupName = button.dataset.powerup;
        activatePowerup(powerupName);
    });
});

// Add new function for switching turns
function switchTurn() {
    if (gameState.gameMode !== 'turn-based') return;
    
    // Find next player
    const currentIndex = gameState.players.findIndex(p => p.id === gameState.currentPlayer);
    const nextIndex = (currentIndex + 1) % gameState.players.length;
    gameState.currentPlayer = gameState.players[nextIndex].id;
    
    // Reset turn timer
    gameState.timeRemaining = gameState.players[nextIndex].turnTime;
    
    // Clear canvas for the next player
    clearCanvas();
    
    // Update UI
    updatePlayerTurn();
    updateTimer();
    
    // Show turn message
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
    showMessage(`${currentPlayer.name}'s turn!`);
}

// Add function to update player turn UI
function updatePlayerTurn() {
    const playerItems = document.querySelectorAll('.player-item');
    playerItems.forEach((item, index) => {
        const playerId = index + 1;
        if (playerId === gameState.currentPlayer) {
            item.classList.add('active-turn');
        } else {
            item.classList.remove('active-turn');
        }
    });
}

// Add game mode selection
function setGameMode(mode) {
    gameState.gameMode = mode;
    
    // Update mode buttons
    const modeButtons = document.querySelectorAll('.mode-button');
    modeButtons.forEach(button => {
        if (button.textContent.includes(mode === 'turn-based' ? 'Take Turns' : 
                                      mode === 'simultaneous' ? 'All Paint Together' : 
                                      'Free Paint')) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update game status
    gameStatus.textContent = mode === 'turn-based' ? 'Take turns painting!' : 
                            mode === 'simultaneous' ? 'Paint together!' : 
                            'Free Paint Mode!';
    
    // Show mode change message
    showMessage(mode === 'turn-based' ? 'Take turns mode selected!' : 
               mode === 'simultaneous' ? 'Paint together mode selected!' : 
               'Free paint mode selected!');
    
    // If switching to free paint mode, start immediately
    if (mode === 'free-paint') {
        startGame();
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    // Load saved data
    loadFromLocalStorage();
    
    // Initialize UI
    updateScore();
    updateTimer();
    updatePowerupUI();
    
    // Preload sample images
    gameState.sampleImages.forEach(img => {
        const image = new Image();
        image.src = img.url;
    });
    
    // Start game after a short delay
    setTimeout(startGame, 1000);
});

// Sample image viewer functionality
const sampleImageViewer = document.querySelector('.sample-image-viewer');
const sampleImg = document.getElementById('sampleImage');
const prevImgButton = document.getElementById('prevImageButton');
const nextImgButton = document.getElementById('nextImageButton');

// Challenge selection functionality
const challengeElements = document.querySelectorAll('.challenge-item');

// Initialize sample image viewer
function initializeSampleImageViewer() {
    if (gameState.sampleImages.length > 0) {
        // Make sure the sample image viewer is visible
        sampleImageViewer.style.display = 'block';
        
        // Set initial sample image
        gameState.currentSampleImageIndex = 0;
        updateSampleImage();
        
        // Preload all sample images
        gameState.sampleImages.forEach(img => {
            const image = new Image();
            image.onload = () => {
                console.log(`Loaded sample image: ${img.title}`);
            };
            image.onerror = (error) => {
                console.error(`Error loading sample image: ${img.title}`, error);
                showMessage(`Error loading ${img.title} image. Please try again.`);
            };
            image.src = img.url;
        });
    } else {
        sampleImageViewer.style.display = 'none';
        console.warn('No sample images available');
    }
}

// Navigate to previous image
function showPreviousImage() {
    gameState.currentSampleImageIndex = (gameState.currentSampleImageIndex - 1 + gameState.sampleImages.length) % gameState.sampleImages.length;
    updateSampleImage();
    playSound('brush');
}

// Navigate to next image
function showNextImage() {
    gameState.currentSampleImageIndex = (gameState.currentSampleImageIndex + 1) % gameState.sampleImages.length;
    updateSampleImage();
    playSound('brush');
}

// Handle challenge selection
function handleChallengeSelection(challengeId) {
    const imageIndex = gameState.sampleImages.findIndex(img => img.id === challengeId);
    if (imageIndex !== -1) {
        gameState.currentSampleImageIndex = imageIndex;
        updateSampleImage();
        playSound('brush');
        
        // Make sure the sample image is visible
        sampleImg.style.display = 'block';
    }
}

// Event listeners
prevImgButton.addEventListener('click', showPreviousImage);
nextImgButton.addEventListener('click', showNextImage);

challengeElements.forEach(item => {
    item.addEventListener('click', () => {
        const challengeId = item.getAttribute('data-challenge');
        handleChallengeSelection(challengeId);
    });
});

// Initialize sample image viewer on load
initializeSampleImageViewer();

// Add new functions for image comparison
function compareImages(drawnCanvas, sampleImage) {
    // Create temporary canvases for comparison
    const tempCanvas1 = document.createElement('canvas');
    const tempCanvas2 = document.createElement('canvas');
    const ctx1 = tempCanvas1.getContext('2d');
    const ctx2 = tempCanvas2.getContext('2d');
    
    // Set canvas sizes
    tempCanvas1.width = 100;
    tempCanvas1.height = 100;
    tempCanvas2.width = 100;
    tempCanvas2.height = 100;
    
    // Draw and resize both images
    ctx1.drawImage(drawnCanvas, 0, 0, 100, 100);
    ctx2.drawImage(sampleImage, 0, 0, 100, 100);
    
    // Get image data
    const data1 = ctx1.getImageData(0, 0, 100, 100).data;
    const data2 = ctx2.getImageData(0, 0, 100, 100).data;
    
    // Compare pixels
    let matches = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < data1.length; i += 4) {
        // Skip transparent pixels
        if (data1[i + 3] === 0 && data2[i + 3] === 0) continue;
        
        totalPixels++;
        
        // Check if pixels are similar (allow for some color variation)
        const diff = Math.abs(data1[i] - data2[i]) +
                    Math.abs(data1[i + 1] - data2[i + 1]) +
                    Math.abs(data1[i + 2] - data2[i + 2]);
        
        if (diff < 100) { // Threshold for similarity
            matches++;
        }
    }
    
    // Calculate similarity percentage
    const similarity = totalPixels > 0 ? (matches / totalPixels) * 100 : 0;
    
    // Update drawing score
    gameState.currentDrawingScore = Math.round(similarity);
    drawingScore.textContent = `Drawing Score: ${gameState.currentDrawingScore}%`;
    
    // Show feedback message
    if (similarity >= 80) {
        showMessage('Amazing job! Your drawing looks very similar!');
    } else if (similarity >= 60) {
        showMessage('Good job! Keep practicing!');
    } else {
        showMessage('Keep trying! You can do it!');
    }
    
    return similarity;
}

// Add check drawing button functionality
checkDrawingButton.addEventListener('click', () => {
    const currentImage = gameState.sampleImages[gameState.currentSampleImageIndex];
    const sampleImg = document.getElementById('sampleImage');
    
    if (sampleImg.complete) {
        compareImages(canvas, sampleImg);
    } else {
        showMessage('Please wait for the sample image to load completely.');
    }
});

function evaluateDrawing() {
    const canvas = document.getElementById('canvas');
    const sampleImg = document.getElementById('sampleImage');
    
    if (!sampleImg.src) {
        showMessage('Please select a drawing challenge first!');
        return;
    }
    
    // Add loading state to buttons during evaluation
    const buttons = document.querySelectorAll('.sample-image-button');
    buttons.forEach(button => button.disabled = true);
    
    const score = compareImages(canvas, sampleImg);
    gameState.currentDrawingScore = score;
    
    // Update score display with animation
    drawingScore.textContent = '';
    setTimeout(() => {
        drawingScore.textContent = `Drawing Score: ${score}%`;
    }, 100);
    
    // Provide detailed feedback based on score
    let feedback = '';
    let emoji = '';
    
    if (score >= 90) {
        feedback = 'Amazing job! Your drawing is almost perfect!';
        emoji = '🌟';
    } else if (score >= 70) {
        feedback = 'Great work! Your drawing looks very similar!';
        emoji = '🎨';
    } else if (score >= 50) {
        feedback = 'Good effort! Keep practicing!';
        emoji = '💪';
    } else {
        feedback = 'Keep trying! You can do better!';
        emoji = '🎯';
    }
    
    // Show feedback with emoji
    showMessage(`${feedback} ${emoji}`);
    
    // Add score to player's total with animation
    addScore(Math.floor(score / 10));
    
    // Re-enable buttons after evaluation
    setTimeout(() => {
        buttons.forEach(button => button.disabled = false);
    }, 1000);
}

// Add event listener for check drawing button
checkDrawingButton.addEventListener('click', evaluateDrawing); 