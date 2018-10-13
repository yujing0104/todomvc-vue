;(function(){
	
	Vue.directive('focus',{
		// bind(el, binding){
		// 	console.log(el)
		// 	el.style.color='red'
		// }
		inserted:function(el){
			el.focus()
		}
	})

	Vue.directive('todo-focus', {
		update(el, binding){
			// console.log('todo-focus')
			if(binding.value){
				el.focus()
			}
		}
	})

	window.app = new Vue({
		data:{
			todos:JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing:null,
			filterText:'active'
		},
		computed:{
			remaingCount:{
				get() {
          			return this.todos.filter(t => !t.completed).length
        		}
			},
			toggleAllStat:{
				get(){
					return this.todos.every(t=>t.completed)
				},
				set(){
					const checked = !this.toggleAllStat
					this.todos.forEach(item =>{
						item.completed = checked
					})
				}
			},
			filterTodos(){
				switch(this.filterText){
					case 'active':
						return this.todos.filter(t=>!t.completed)
						break
					case 'completed':
						return this.todos.filter(t=>t.completed)
						break
					default:
						return this.todos
						break
				}
				
			},
		},
		watch: {
      // 监视 todos 的改变，当 todos 发生变化的时候做业务定制处理
      // 引用类型只能监视一层，无法监视内部成员的子成员的改变
     	 todos: {
        // 当监视到 todos 改变的时候会自动调用 handler 方法
        // 你监视的谁，val 就是谁
        // val 的变化之后的最新值
        // oldVal 是变化之前的值
        handler (val, oldVal) {
          // 监视到 todos 变化，把 todos 本次存储记录数据的状态
          // 这里既可以通过 this.todos 来访问，也可以通过 val 来得到最新的 todos
          window.localStorage.setItem('todos', JSON.stringify(val))
        },
        deep: true, // 深度监视，只有这样才能监视到数组或者对象孩子...孩子... 成员的改变
        // immediate: true // 无乱变化与否，你上来就给我调用一次，如何使用看需求
      }
    },
		methods:{
			handleNewTodoKeyDown(e){
				// console.log(111)
				const target = e.target
				const value = target.value.trim()
				if(!value.length){
					return
				}
				const todos = this.todos
				todos.push({
					id: todos.length ? todos[todos.length - 1].id + 1 : 1 ,
					title: value,
					completed: false
				})
				target.value=''
			},
			handleToggleAllChange(e){
				const checked = e.target.checked
				this.todos.forEach(item =>{
					item.completed = checked
				})
			},
			handleRemoveTodoClick(index,e){
				this.todos.splice(index,1)
			},
			handleGetEditingDblclick(todo){
				// console.log(todo)
				this.currentEditing = todo
			},
			handleSaveEditKeydown(todo,index,e){
				const target = e.target
				const value = target.value.trim()
				if(!value.length){
					this.todos.splice(index,1)
				}else{
					todo.title = value
					this.currentEditing = null
				}
			},
			handleCancelEditEsc(){
				this.currentEditing = null
			},
			handleClearAllDoneClick(){
				// this.todos.forEach(item =>{
				// 	if(item.completed){
				// 		this.todos.splice(index,1)
				// 	}
				// })
				for(let i = 0;i<this.todos.length;i++){
					if(this.todos[i].completed){
						this.todos.splice(i,1)
						i--
					}
				}			
		    }
		}
	}).$mount('#app')

	handlehashchange()

	window.onhashchange = handlehashchange

	function handlehashchange(){
		app.filterText = window.location.hash.substr(2)
	}
	
})()