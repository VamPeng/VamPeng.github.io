'use client'
import { useEffect, useState } from 'react'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/filled-text-field.js'
import '@material/web/iconbutton/icon-button.js'

const MENU_ITEMS = [
  {
    key: 'android',
    label: 'Android',
    children: [
      { key: 'android-framework', label: '开发框架 Frameworks' },
      { key: 'android-open-source', label: '开源应用 Open Source Apps' },
    ],
  },
  {
    key: 'frontend',
    label: '前端',
    children: [
      { key: 'frontend-frameworks', label: '框架' },
      { key: 'frontend-ui', label: 'UI 库' },
      { key: 'frontend-build', label: '构建工具' },
      { key: 'frontend-state', label: '状态管理' },
    ],
  },
  {
    key: 'backend',
    label: '后端',
    children: [
      { key: 'backend-languages', label: '语言' },
      { key: 'backend-frameworks', label: '框架' },
      { key: 'backend-database', label: '数据库' },
      { key: 'backend-microservices', label: '微服务' },
    ],
  },
  {
    key: 'rust',
    label: 'Rust',
    children: [
      { key: 'rust-framework', label: '框架' },
      { key: 'rust-project', label: '项目' },
    ],
  },
]

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [selectedMenu, setSelectedMenu] = useState('android')
  const [selectedSubMenu, setSelectedSubMenu] = useState('android-framework')
  const [androidOpen, setAndroidOpen] = useState(true)
  const [frontendOpen, setFrontendOpen] = useState(false)
  const [backendOpen, setBackendOpen] = useState(false)
  const [rustOpen, setRustOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    // 设置初始主题为深色模式
    document.documentElement.className = 'dark'
    document.body.className = 'dark'

    // 获取 GitHub 头像
    fetch('https://api.github.com/users/vampeng')
      .then(res => res.json())
      .then(data => {
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url)
        }
      })
      .catch(err => {
        console.error('Failed to fetch GitHub avatar:', err)
      })
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.className = next
    document.body.className = next
  }

  // 菜单点击逻辑
  const handleMenuClick = (key: string) => {
    setSelectedMenu(key)
    setAndroidOpen(key === 'android')
    setFrontendOpen(key === 'frontend')
    setBackendOpen(key === 'backend')
    setRustOpen(key === 'rust')
    // 默认选中每个主菜单的第一个子菜单
    const menu = MENU_ITEMS.find(m => m.key === key)
    if (menu && menu.children && menu.children.length > 0) {
      setSelectedSubMenu(menu.children[0].key)
    }
  }

  // 渲染子菜单
  const renderSubMenu = (menuKey: string, open: boolean) => {
    const menu = MENU_ITEMS.find(m => m.key === menuKey)
    if (!menu || !menu.children) return null
    return (
      <div
        style={{
          maxHeight: open ? menu.children.length * 56 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
          marginLeft: 16,
          marginRight: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {menu.children.map(child => (
          <button
            key={child.key}
            className={`menu-btn${selectedSubMenu === child.key ? ' selected' : ''}`}
            style={{
              background: selectedSubMenu === child.key ? 'var(--md-sys-color-primary)' : 'transparent',
              color: selectedSubMenu === child.key ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 15,
              fontWeight: 400,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s, color 0.2s',
              width: '100%'
            }}
            onClick={() => {
              setSelectedMenu(menuKey)
              setSelectedSubMenu(child.key)
            }}
          >
            {child.label}
          </button>
        ))}
      </div>
    )
  }

  // 根据菜单生成关键词
  function getSearchKeyword(menu: string, subMenu: string) {
    const map: Record<string, string> = {
      // Android 开发框架：搜索高星 android library/framework
      'android-framework': 'android library OR android framework topic:android',
      // Android 开源应用：搜索高星 android open source app
      'android-open-source': 'android open source app OR android app topic:android',
      'frontend-frameworks': 'frontend framework',
      'frontend-ui': 'frontend ui',
      'frontend-build': 'frontend build tool',
      'frontend-state': 'frontend state management',
      'backend-languages': 'backend language',
      'backend-frameworks': 'backend framework',
      'backend-database': 'database',
      'backend-microservices': 'microservices',
      'rust-framework': 'rust framework',
      'rust-project': 'rust project',
    }
    return map[subMenu] || menu
  }

  // 监听菜单变化自动搜索
  useEffect(() => {
    if (!selectedSubMenu) return
    setPage(1)
  }, [selectedMenu, selectedSubMenu])

  useEffect(() => {
    if (!selectedSubMenu) return
    const keyword = getSearchKeyword(selectedMenu, selectedSubMenu)
    const cacheKey = `gh-search-${keyword}-page-${page}`
    const cache = localStorage.getItem(cacheKey)
    let cacheData: { items: any[]; ts: number; total: number } | null = null
    if (cache) {
      try {
        cacheData = JSON.parse(cache)
      } catch {}
    }
    const now = Date.now()
    if (cacheData && now - cacheData.ts < 3600_000) {
      if (page === 1) {
        setSearchResults(cacheData.items)
      } else {
        setSearchResults(prev => [...prev, ...cacheData.items])
      }
      setHasMore(cacheData.items.length > 0 && (cacheData.total || 0) > page * 10)
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}&sort=stars&order=desc&per_page=10&page=${page}`)
      .then(res => res.json())
      .then(data => {
        if (page === 1) {
          setSearchResults(data.items || [])
        } else {
          setSearchResults(prev => [...prev, ...(data.items || [])])
        }
        setHasMore((data.items?.length || 0) === 10)
        localStorage.setItem(cacheKey, JSON.stringify({ items: data.items || [], ts: now, total: data.total_count }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedMenu, selectedSubMenu, page])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏 */}
      <header style={{
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--md-sys-color-outline-variant)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <md-icon-button>
            <span className="material-icons">menu</span>
          </md-icon-button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="GitHub Avatar"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '2px solid var(--md-sys-color-outline-variant)'
                }}
              />
            )}
            <h1 style={{
              fontSize: 24,
              fontWeight: 500,
              color: 'var(--md-sys-color-on-surface)',
              margin: 0
            }}>Vam</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <md-icon-button onClick={toggleTheme}>
            <span className="material-icons">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
          </md-icon-button>
        </div>
      </header>

      {/* 主要内容区 */}
      <main style={{
        flex: 1,
        padding: '32px',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        gap: 32,
        minHeight: 0,
        flexGrow: 1
      }}>
        {/* 左侧菜单栏 */}
        <nav style={{
          width: 240,
          minWidth: 180,
          background: 'var(--md-sys-color-surface-container)',
          borderRadius: 16,
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxSizing: 'border-box',
          alignItems: 'stretch',
          height: '100%',
          overflow: 'hidden',
        }}>
          {/* Android 主菜单 */}
          <button
            className={`menu-btn${selectedMenu === 'android' ? ' selected' : ''}`}
            style={{
              background: selectedMenu === 'android' ? 'var(--md-sys-color-primary)' : 'transparent',
              color: selectedMenu === 'android' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
              border: 'none',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s, color 0.2s',
              width: '100%'
            }}
            onClick={() => handleMenuClick('android')}
          >
            Android
          </button>
          {renderSubMenu('android', androidOpen)}
          {/* 前端主菜单 */}
          <button
            className={`menu-btn${selectedMenu === 'frontend' ? ' selected' : ''}`}
            style={{
              background: selectedMenu === 'frontend' ? 'var(--md-sys-color-primary)' : 'transparent',
              color: selectedMenu === 'frontend' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
              border: 'none',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s, color 0.2s',
              width: '100%'
            }}
            onClick={() => handleMenuClick('frontend')}
          >
            前端
          </button>
          {renderSubMenu('frontend', frontendOpen)}
          {/* 后端主菜单 */}
          <button
            className={`menu-btn${selectedMenu === 'backend' ? ' selected' : ''}`}
            style={{
              background: selectedMenu === 'backend' ? 'var(--md-sys-color-primary)' : 'transparent',
              color: selectedMenu === 'backend' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
              border: 'none',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s, color 0.2s',
              width: '100%'
            }}
            onClick={() => handleMenuClick('backend')}
          >
            后端
          </button>
          {renderSubMenu('backend', backendOpen)}
          {/* Rust 主菜单 */}
          <button
            className={`menu-btn${selectedMenu === 'rust' ? ' selected' : ''}`}
            style={{
              background: selectedMenu === 'rust' ? 'var(--md-sys-color-primary)' : 'transparent',
              color: selectedMenu === 'rust' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
              border: 'none',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s, color 0.2s',
              width: '100%'
            }}
            onClick={() => handleMenuClick('rust')}
          >
            Rust
          </button>
          {renderSubMenu('rust', rustOpen)}
        </nav>
        {/* 右侧内容区 */}
        <section style={{
          flex: 1,
          background: 'var(--md-sys-color-surface-container)',
          borderRadius: 16,
          padding: 24,
          minHeight: 400
        }}>
          {/* 搜索结果区（卡片+缓存+分页） */}
          {loading && page === 1 ? (
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center', padding: 32 }}>加载中...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {searchResults.length === 0 && <div style={{ color: 'var(--md-sys-color-on-surface-variant)', gridColumn: '1/-1' }}>暂无相关项目</div>}
              {searchResults.map((repo: any) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: 'var(--md-sys-color-on-surface)',
                    background: 'var(--md-sys-color-surface-container-high)',
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={repo.owner.avatar_url} alt={repo.owner.login} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{repo.full_name}</span>
                  </div>
                  <div style={{
                    color: 'var(--md-sys-color-on-surface-variant)',
                    fontSize: 15,
                    minHeight: 36,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
                  }}>
                    {repo.description}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: 'var(--md-sys-color-on-surface-variant)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-icons" style={{ fontSize: 16 }}>star</span>
                      {repo.stargazers_count}
                    </span>
                    {repo.language && <span>{repo.language}</span>}
                  </div>
                </a>
              ))}
            </div>
          )}
          {/* 加载更多按钮 */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            {hasMore && !loading && (
              <button
                style={{
                  padding: '10px 32px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--md-sys-color-primary)',
                  color: 'var(--md-sys-color-on-primary)',
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onClick={() => setPage(p => p + 1)}
              >
                加载更多
              </button>
            )}
            {loading && page > 1 && <div style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 12 }}>加载中...</div>}
          </div>
        </section>
      </main>
    </div>
  )
}
