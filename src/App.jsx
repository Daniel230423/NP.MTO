import { useEffect, useMemo, useState } from 'react'
import './App.css'

const CATEGORIES = {
  all: 'Всё',
  props: 'Реквизит',
  costumes: 'Костюмы',
  decor: 'Декорации',
}

const INITIAL_ITEMS = [
  {
    id: 1,
    category: 'props',
    name: 'Деревянная шкатулка',
    description: 'Старинная малая шкатулка для сценического действия с мягким закрытием.',
    material: 'Дерево, лак',
    quantity: '2 штуки',
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    category: 'costumes',
    name: 'Костюм Микки',
    description: 'Яркий сценический комплект с подкладкой и удобной посадкой для движений.',
    material: 'Синтетика, хлопок',
    quantity: 'Размеры S–L',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    category: 'decor',
    name: 'Театральный занавес',
    description: 'Глубокий красный занавес для смены сцен и оформления первого плана.',
    material: 'Полиэстер, габардин',
    quantity: '1 набор',
    image:
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80',
  },
]

const emptyForm = {
  category: 'props',
  name: '',
  description: '',
  material: '',
  quantity: '',
  image: '',
}

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('theatre-catalog')
    return saved ? JSON.parse(saved) : INITIAL_ITEMS
  })
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [login, setLogin] = useState({ username: '', password: '' })
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('theatre-catalog', JSON.stringify(items))
  }, [items])

  const filteredItems = useMemo(() => {
    const value = query.trim().toLowerCase()

    return items.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category
      const matchesQuery =
        !value ||
        item.name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value) ||
        item.material.toLowerCase().includes(value)

      return matchesCategory && matchesQuery
    })
  }, [category, items, query])

  const handleLogin = (event) => {
    event.preventDefault()
    if (login.username === 'admin' && login.password === 'theatre2026') {
      setIsAdmin(true)
      setIsLoginOpen(false)
      setLogin({ username: '', password: '' })
      setMessage('Вы вошли в режим редактирования.')
      return
    }

    setMessage('Неверный логин или пароль.')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.description.trim()) {
      setMessage('Укажите название и описание карточки.')
      return
    }

    const nextItem = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      material: form.material.trim() || 'Материал уточняется',
      quantity: form.quantity.trim() || 'Количество уточняется',
      image:
        form.image.trim() ||
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    }

    if (editingId) {
      setItems((current) =>
        current.map((item) => (item.id === editingId ? { ...item, ...nextItem } : item)),
      )
      setMessage('Карточка обновлена.')
    } else {
      setItems((current) => [{ id: Date.now(), ...nextItem }, ...current])
      setMessage('Новая карточка добавлена.')
    }

    setForm(emptyForm)
    setEditingId(null)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm({ ...item })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setMessage('Карточка удалена.')
    if (editingId === id) {
      setEditingId(null)
      setForm(emptyForm)
    }
  }

  const logout = () => {
    setIsAdmin(false)
    setMessage('Вы вышли из режима редактирования.')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="На главную">
          <span className="brand-mark">NP</span>
          <span>
            <strong>НТК «Мастерская театра»</strong>
            <small>Педагогическая витрина</small>
          </span>
        </a>

        <nav className="nav" aria-label="Основная навигация">
          <a href="#catalog">Каталог</a>
          <a href="#about">О студии</a>
          {isAdmin ? (
            <button type="button" className="nav-button" onClick={logout}>
              Выйти
            </button>
          ) : (
            <button type="button" className="nav-button" onClick={() => setIsLoginOpen(true)}>
              Для администрации
            </button>
          )}
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Театральная студия для детей и взрослых</p>
            <h1>Сцена, где рождаются образы, характеры и настоящая любовь к театру.</h1>
            <p className="hero-text">
              Развиваем актёрское мастерство, импровизацию и творческую уверенность на занятиях,
              которые соединяют дисциплину и радость творчества.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#catalog">Посмотреть материалы</a>
              <a className="secondary-btn" href="#about">Узнать о программе</a>
            </div>
            <ul className="hero-stats" aria-label="Показатели студии">
              <li><strong>8+</strong><span>лет опыта</span></li>
              <li><strong>300+</strong><span>участников</span></li>
              <li><strong>40+</strong><span>постановок</span></li>
            </ul>
          </div>

          <div className="hero-visual" aria-label="Сцена театрального мастерства">
            <div className="picture-card large-card">
              <span>Спектакль</span>
              <strong>Театр в каждом движении</strong>
            </div>
            <div className="picture-card small-card">
              <span>Создание образа</span>
              <strong>Собираем историю</strong>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <div>
            <p className="section-label">О студии</p>
            <h2>Творчество, которое помогает раскрыться.</h2>
          </div>
          <p>
            Мы объединяем обучение актёрскому мастерству, выразительности и командной работе.
            Каждый проект помогает детям и подросткам находить свою сценическую речь, делать
            смелые творческие выборы и чувствовать себя уверенно на площадке и в жизни.
          </p>
        </section>

        <section className="catalog" id="catalog">
          <div className="section-heading">
            <div>
              <p className="section-label">Онлайн-витрина</p>
              <h2>Материалы и реквизит для занятий</h2>
            </div>
            {isAdmin && <span className="admin-badge">Режим редактирования</span>}
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск по названию, материалу или описанию"
              />
            </div>

            <div className="category-switcher" aria-label="Категории материалов">
              {Object.entries(CATEGORIES).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={category === value ? 'active' : ''}
                  onClick={() => setCategory(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {message && <p className="status-message" role="status">{message}</p>}

          <div className="catalog-grid">
            {filteredItems.map((item) => (
              <article className="catalog-card" key={item.id}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="card-content">
                  <span className="card-category">{CATEGORIES[item.category]}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <dl>
                    <div><dt>Материал</dt><dd>{item.material}</dd></div>
                    <div><dt>Количество</dt><dd>{item.quantity}</dd></div>
                  </dl>
                  {isAdmin && (
                    <div className="card-actions">
                      <button type="button" onClick={() => startEdit(item)}>Редактировать</button>
                      <button type="button" className="danger" onClick={() => removeItem(item.id)}>
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="empty-state">
              <strong>Ничего не найдено</strong>
              <p>Попробуйте выбрать другую категорию или изменить поисковый запрос.</p>
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="editor" aria-labelledby="editor-title">
            <div className="section-heading compact">
              <div>
                <p className="section-label">Редактор каталога</p>
                <h2 id="editor-title">{editingId ? 'Редактировать карточку' : 'Добавить новую карточку'}</h2>
              </div>
            </div>

            <form className="editor-form" onSubmit={handleSubmit}>
              <label>
                Категория
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  <option value="props">Реквизит</option>
                  <option value="costumes">Костюмы</option>
                  <option value="decor">Декорации</option>
                </select>
              </label>
              <label>
                Название
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Например: Плетёный коричневый сундук"
                />
              </label>
              <label className="wide">
                Описание
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Опишите, для какой сцены или постановки подходит предмет"
                />
              </label>
              <label>
                Материал
                <input
                  value={form.material}
                  onChange={(event) => setForm({ ...form, material: event.target.value })}
                  placeholder="Например: Дерево, ткань"
                />
              </label>
              <label>
                Количество
                <input
                  value={form.quantity}
                  onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                  placeholder="Например: 6 костюмов"
                />
              </label>
              <label className="wide">
                Ссылка на изображение
                <input
                  value={form.image}
                  onChange={(event) => setForm({ ...form, image: event.target.value })}
                  placeholder="https://..."
                />
              </label>
              <div className="form-actions wide">
                <button type="submit" className="primary-btn">
                  {editingId ? 'Сохранить изменения' : 'Добавить карточку'}
                </button>
                {editingId && (
                  <button type="button" className="secondary-btn" onClick={() => setForm(emptyForm)}>
                    Отменить
                  </button>
                )}
              </div>
            </form>
          </section>
        )}
      </main>

      <footer>
        <p>НТК «Мастерская театра» · Создаём сценические образы вместе.</p>
        <a href="#home">Вернуться наверх ↑</a>
      </footer>

      {isLoginOpen && (
        <div className="modal-backdrop" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" onClick={() => setIsLoginOpen(false)}
              aria-label="Закрыть вход">×</button>
            <p className="section-label">Вход для администрации</p>
            <h2>Добро пожаловать</h2>
            <form onSubmit={handleLogin}>
              <label>
                Логин
                <input
                  value={login.username}
                  onChange={(event) => setLogin({ ...login, username: event.target.value })}
                  placeholder="admin"
                />
              </label>
              <label>
                Пароль
                <input
                  type="password"
                  value={login.password}
                  onChange={(event) => setLogin({ ...login, password: event.target.value })}
                  placeholder="Введите пароль"
                />
              </label>
              <button type="submit" className="primary-btn full-width">Войти</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
