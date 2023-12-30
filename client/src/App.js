import './App.css';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react'
function App() {
    const [join, setJoin] = useState(false)
    const [participants, setParticipants] = useState([])
    const [sum, setSum] = useState(0)
    const [name, setName] = useState('')
    const [id, setId] = useState('')
    const socket = useRef()
    const [input, setInput] = useState()

    const [message, setMessage] = useState([])

    useEffect(() => {
        socket.current = io('http://192.168.2.185:5000', {

        })
        // Xử lý sự kiện khi kết nối thành công
        socket.current.on('connect', () => {
            console.log('Connected to server');
        });
        socket.current.on('return_id_connect', (id) => {
            console.log('Your id is: ' + id);
            setId(id);
        });
        // Xử lý sự kiện khi ngắt kết nối
        socket.current.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        return () => socket.current.disconnect();
    }, [])

    useEffect(() => {
        if (join) {
            socket.current.on('server-message', (data) => {
                console.log('Received message from server:', data);
            });
            // máy khác join
            socket.current.on('another-join', (data) => {
                console.log('Another join:', data);
            });

            // máy khác gửi số lên server
            socket.current.on('message-from-another', (data) => {
                console.log('Message from another:', data);
                setMessage(old => [...old, data])
            });

            socket.current.on('server-sum', (data) => {
                setSum(parseInt(data))
            });
        }
    }, [join])

    return (
        <div className="App">
            {!join ? (
                <div className='flex items-center justify-center' style={{ width: '100vw', height: '100vh', background: '#d1d1d1' }}>
                    <div className='connect'>
                        <p className='text-medium'>Ten cua ban</p>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder='Ten cua ban' className='input' />
                        <button
                            className='btn'
                            onClick={() => {
                                setJoin(true)
                                socket.current.emit('login', name);
                            }}
                        >
                            Kết nối
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex'>

                    <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <p className='y-name'>{name}</p>
                        </div>
                        <div
                            style={{ flex: 1, flexDirection: 'column' }}
                            className='flex items-center justify-center main-box'
                        >
                            <div className='flex items-center' style={{flexDirection: 'column', width: 100}}>
                                <p >Number</p>
                                <p className='result'>
                                    {sum}
                                </p>
                            </div>
                            <div className='flex' style={{ gap: 10 }}>
                                <input
                                    type='number'
                                    value={input} onChange={e => setInput(e.target.value)}
                                    placeholder='Nhập số từ 1 - 10'
                                    className='input'
                                />
                                <button className='send' onClick={() => {
                                    socket.current.emit('client-send-number', input);
                                }}>
                                    <svg style={{ width: 30, height: 30, cursor: 'pointer' }} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <rect width="35" height="35" fill="url(#pattern0)" />
                                        <defs>
                                            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                                <use xlinkHref="#image0_1_62" transform="scale(0.0111111)" />
                                            </pattern>
                                            <image id="image0_1_62" width="90" height="90" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADBElEQVR4nO2dv2sUQRTHP5ozaqMHF1CwEUVLBW0sxF+NlaV2igr+CGha/wUVBAst/BdsLQ8VNBgTDYqFxEILYxH10CJRMHD3ZGGEK8wZzp2dN2/fB7717nx3d2bezJu34DiO4ziO4ziOY5D1wATwHFgCvgPPgEvAxtQ3Z4VtwGtAVtAn4ALQSH2jub/Jg0zu1zvgFLAm9U3nyMQqTe7XLHA89Y3nxvQQRkvQY+BA6gbkwuJ/GC1BbWBv6oZoR0pSF7gP7EzdIOtGS9AycA/Ymrph1o2WoGIufh3YnLqB1o2WoA5wzYOe+EZL0Dxwsc5Bj1SsOeBkHYMeSaQZ4AQ1QhJrEjhIDRAlagN7MIwoUjcEPTswiCjUrxD0bMEQoliLloIeyUCdEPRsIGMkI30MQc8IGSIZ6m2OQY9krGngGJkgBtQG9qMcMaJemIPvRikdBSZJhKBnO8p4osAciaCfwE2ghRLOKTBFKgh6NqU2uhGWLMW4FoArwGhKs4vP64UCM6QCfQBOA2tTmV1EW2eBqbCxKsb1RsvGQzPMTc+EPu4B8F6BQVKyiuzZoyikafQBFEHPPjKgaeAB/Al6dpEhLeAwcBm4AzwCPisw9V/ZVrdTz1DKYgw4AowDd8MD+KLA5H7dwjBjf3kAXxMZXVzXLGOK3vTiutnTCn33eF/fra3ruEFmhh7qGwwfZjIYFv3zOhTS9OmdGyqaA5aV3tCegk876xB8JKxNFxf+ocAAsbioVAxYLxU0XiwvkzZqsha9kHrh/7wCE6QOW1lPFZghddic9XSDihAj6mlPoBEDantKGFEN9iRH4hrsabvENdgT0YlrsB+tIK7BfliIuAb78bfIBnf9QGd8tf2IclyDJ/3QfVyDZ7Rkc1aFVKy5HM8IlkFVBs97qZ+4Bne8eFXcN3rJUmWCMijb4GUvMBjX6K6XzByMF4GtCC9rXBFXh+gmZr1Q93Cl51+t0mAvPV/CzxQGme0/UyiR0ZAyNRUGyG9hwaeoYeS/B3Ecx3Ecx3EcxyETfgNshlXg/IvjUQAAAABJRU5ErkJggg==" />
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '30%' }}>
                        <div className='box-chat'>
                            <p>Tin nhắn</p>
                            <div className='box'>
                                {message.map(msg => (
                                    <div key={msg.time} className='message'>
                                        <p className='name'>
                                            {msg?.name}
                                        </p>
                                        <div className='flex justify-between'>
                                            <p className='text-small'>{msg?.address}</p>
                                            <p className='text-small'>{new Date(msg?.time).toLocaleString()}</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <p className='number'>{msg?.message}</p>
                                            <p className={`${msg?.success ? 'success' : 'fail'}`}>{msg?.success ? 'success' : 'sai'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default App;
