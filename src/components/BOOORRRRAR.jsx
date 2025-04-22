{/* -------- Esta parte es la que es de mi sistema y funciona - */}
<div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                {/* aca falta el label*/}
                <input
                    type="text"
                    placeholder="Username"
                    value={user.username}
                    onChange={(e) => setUser({...user, username: e.target.value})}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}

            {/* ver si esto aca queda bien */}
            <h5>¿No tenes cuenta?</h5>
            <button onClick={() => navigate('/createClient')}>Registrate</button> 
        </div>
        {/* ---------------- */}